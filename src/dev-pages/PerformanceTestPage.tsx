import React, { useEffect, useRef, useState } from "react";
import * as ort from "onnxruntime-web";
import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";
import { LOG } from "../lib/Logging";
import { useOtoProjectStore } from "../store/otoProjectStore";
import { PerformanceTracker } from "../lib/PerformanceMetrics";
import { MelSpectrogramExtractor } from "../lib/MelSpectrogramExtractor";
import { parseAliasToPhonemes, phonemesToConditionVector, TOTAL_COND_DIM } from "../lib/PhonemeCondition";
import { LoadZipDialog } from "../features/LoadZipDialog/LoadZipDialog";
import { TargetDirDialog } from "../components/TargetDirDialog/TargetDirDialog";

interface TestResult {
  alias: string;
  wav: string;
  status: "success" | "error" | "skipped";
  error?: string;
  melSpectrogramTimeMs?: number;
  conditionTimeMs?: number;
  inferenceTimeMs?: number;
}

export const PerformanceTestPage: React.FC = () => {
  const {
    readZip,
    oto,
    targetDir,
    setReadZip,
    targetDirs,
    setTargetDirs,
    setTargetDir,
    setOto,
  } = useOtoProjectStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [zipDialogOpen, setZipDialogOpen] = useState(false);
  const [targetDirDialogOpen, setTargetDirDialogOpen] = useState(false);
  const [readFile, setReadFile] = useState<File | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  const float32ToFloat16Bits = (value: number): number => {
    if (Number.isNaN(value)) return 0x7e00;
    if (value === Infinity) return 0x7c00;
    if (value === -Infinity) return 0xfc00;

    const sign = value < 0 || Object.is(value, -0) ? 0x8000 : 0;
    let abs = Math.abs(value);

    if (abs === 0) return sign;
    if (abs >= 65504) return sign | 0x7bff;
    if (abs < 2 ** -24) return sign;

    if (abs < 2 ** -14) {
      const mantissa = Math.round(abs / 2 ** -24);
      return sign | mantissa;
    }

    const exponent = Math.floor(Math.log2(abs));
    const exponentBits = exponent + 15;
    const mantissaNorm = abs / 2 ** exponent - 1;
    const mantissaBits = Math.round(mantissaNorm * 1024);

    if (mantissaBits === 1024) {
      if (exponentBits + 1 >= 31) {
        return sign | 0x7c00;
      }
      return sign | ((exponentBits + 1) << 10);
    }

    return sign | (exponentBits << 10) | mantissaBits;
  };

  const float32ArrayToFloat16 = (src: Float32Array): Uint16Array => {
    const dst = new Uint16Array(src.length);
    for (let i = 0; i < src.length; i++) {
      dst[i] = float32ToFloat16Bits(src[i]);
    }
    return dst;
  };

  const yieldToUi = async () => {
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 0);
    });
  };

  const clearRuntimeCaches = async () => {
    if ("serviceWorker" in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
      addLog(`SW解除: ${regs.length}件`);
    }
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      addLog(`Cache削除: ${keys.length}件`);
    }
  };

  useEffect(() => {
    if (!window.location.hash.includes("devmode")) return;
    const disableCacheForDev = async () => {
      try {
        if ("serviceWorker" in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
          console.log(`devmode: unregistered service workers: ${regs.length}`);
        }
        if ("caches" in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map((k) => caches.delete(k)));
          console.log(`devmode: cleared caches: ${keys.length}`);
        }
      } catch (error) {
        console.warn("devmode cache cleanup failed", error);
      }
    };
    void disableCacheForDev();
  }, []);

  const downloadLogs = () => {
    const text = logs.join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `performance-test-${new Date().toISOString()}.log`;
    link.click();
  };

  useEffect(() => {
    if (readZip === null) {
      setTargetDirs(null);
      setTargetDir(null);
      return;
    }
    const nextTargetDirs: string[] = [];
    Object.keys(readZip).forEach((f) => {
      if (f.endsWith(".wav")) {
        const tmps = f.split("/").slice(0, -1).join("/");
        if (!nextTargetDirs.includes(tmps)) {
          nextTargetDirs.push(tmps);
        }
      }
    });
    setTargetDirs(nextTargetDirs);
  }, [readZip, setTargetDir, setTargetDirs]);

  useEffect(() => {
    if (targetDirs !== null) {
      setTargetDirDialogOpen(true);
    }
  }, [targetDirs]);

  const onZipButtonClick = () => {
    setReadZip(null);
    setOto(null);
    setResults([]);
    setLogs([]);
    inputRef.current?.click();
  };

  const onZipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setReadFile(e.target.files[0]);
    setZipDialogOpen(true);
    e.target.value = "";
  };

  const runPerformanceTest = async () => {
    if (!oto || !readZip || targetDir === null) {
      addLog("❌ oto / readZip / targetDir のいずれかが未設定です");
      return;
    }

    const records = oto
      .GetFileNames(targetDir)
      .flatMap((filename) =>
        oto.GetAliases(targetDir, filename).map((alias) =>
          oto.GetRecord(targetDir, filename, alias)
        )
      );
    const MAX_RECORDS = 10;
    const recordsToProcess = records.slice(0, MAX_RECORDS);

    if (records.length === 0) {
      addLog("❌ 対象ディレクトリに原音設定レコードが見つかりません");
      return;
    }

    setIsRunning(true);
    setResults([]);
    setLogs([]);
    setTotalRecords(recordsToProcess.length);
    setProgress(0);
    const tracker = new PerformanceTracker();

    // コンソール出力をキャプチャしてログに追加
    const originalDebug = console.debug;
    console.debug = (...args: any[]) => {
      const message = args.map((a) => 
        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
      ).join(' ');
      addLog(`[DEBUG] ${message}`);
      originalDebug(...args);
    };

    try {
      addLog("========== パフォーマンステスト開始 ==========");
      addLog(`対象ディレクトリ: ${targetDir}`);
      addLog(`総レコード数: ${records.length}`);
      if (records.length > recordsToProcess.length) {
        addLog(`検証モード: 先頭 ${recordsToProcess.length} レコードのみ実行`);
      }
      addLog(`デバイスメモリ: ${(navigator as any).deviceMemory}GB`);

      // 1. ONNX モデル初期化
      addLog("\n--- ONNX モデル初期化 ---");
      const stop1 = tracker.mark("model_load");
      try {
        // 過去に登録されたServiceWorkerやCacheが古いWASM/HTMLを返すケースを潰す
        await clearRuntimeCaches();

        const bust = `v=${Date.now()}`;
        const wasmBase = "/static/ort/";
        const wasmUrl = `${wasmBase}ort-wasm-simd-threaded.wasm?${bust}`;
        const wasmJsepUrl = `${wasmBase}ort-wasm-simd-threaded.jsep.wasm?${bust}`;
        const modelUrl = `/static/autooto_model_fp16.onnx?${bust}`;

        // onnxruntime-web v1.27 の仕様: wasmPaths は {wasm, mjs} を指定する
        // mjs を public 配下で上書きすると Vite dev の ?import 経路で 500 になるため、wasm のみ外部指定する
        ort.env.wasm.wasmPaths = {
          wasm: wasmJsepUrl,
        };
        ort.env.wasm.numThreads = 1;

        // プリフライト: WASMの実体を確認（HTMLが返るケースを早期検出）
        const wasmResponse = await fetch(wasmUrl, { cache: "no-store" });
        const contentType = wasmResponse.headers.get("content-type") || "";
        addLog(
          `WASM preflight: status=${wasmResponse.status}, content-type=${contentType}`
        );
        if (!wasmResponse.ok) {
          throw new Error(`WASM取得失敗: ${wasmResponse.status} ${wasmResponse.statusText}`);
        }
        const wasmBytes = new Uint8Array(await wasmResponse.arrayBuffer());
        const isWasmMagic =
          wasmBytes.length >= 4 &&
          wasmBytes[0] === 0x00 &&
          wasmBytes[1] === 0x61 &&
          wasmBytes[2] === 0x73 &&
          wasmBytes[3] === 0x6d;
        if (!isWasmMagic) {
          throw new Error(
            `WASMシグネチャ不一致: [${Array.from(wasmBytes.slice(0, 4)).join(","
            )}]`
          );
        }

        const jsepResponse = await fetch(wasmJsepUrl, { cache: "no-store" });
        const jsepContentType = jsepResponse.headers.get("content-type") || "";
        addLog(
          `WASM(jsep) preflight: status=${jsepResponse.status}, content-type=${jsepContentType}`
        );
        if (!jsepResponse.ok) {
          throw new Error(
            `WASM(jsep)取得失敗: ${jsepResponse.status} ${jsepResponse.statusText}`
          );
        }
        const jsepBytes = new Uint8Array(await jsepResponse.arrayBuffer());
        const isJsepWasmMagic =
          jsepBytes.length >= 4 &&
          jsepBytes[0] === 0x00 &&
          jsepBytes[1] === 0x61 &&
          jsepBytes[2] === 0x73 &&
          jsepBytes[3] === 0x6d;
        if (!isJsepWasmMagic) {
          throw new Error(
            `WASM(jsep)シグネチャ不一致: [${Array.from(jsepBytes.slice(0, 4)).join(",")}]`
          );
        }

        addLog("WASM(mjs)はライブラリ同梱版を使用");

        const sess = await ort.InferenceSession.create(
          modelUrl,
          {
            executionProviders: ["wasm"],
          }
        );
        stop1();
        addLog(`✅ モデルロード完了 (${tracker.getStats("model_load")?.avgDuration.toFixed(2)}ms)`);

        // モデル入力情報確認
        const inputNames = sess.inputNames;
        addLog(`入力: ${inputNames.join(", ")}`);

        // 2. メルスペクトログラム抽出器初期化
        const extractor = new MelSpectrogramExtractor(44100);

        // 3. 各 oto レコードを処理
        addLog("\n--- 音素推論テスト開始 ---");
        const testResults: TestResult[] = [];

        // WAV単位でレコードをグループ化
        const recordsByWav = new Map<string, Array<{record: typeof recordsToProcess[0], originalIndex: number}>>();
        recordsToProcess.forEach((record, idx) => {
          const wavPath = targetDir === "" ? record.filename : `${targetDir}/${record.filename}`;
          if (!recordsByWav.has(wavPath)) {
            recordsByWav.set(wavPath, []);
          }
          recordsByWav.get(wavPath)!.push({record, originalIndex: idx});
        });

        // WAV単位でループ
        let processedCount = 0;
        for (const [wavPath, recordsForThis] of recordsByWav) {
          const wavFile = readZip[wavPath];
          if (!wavFile) {
            // このWAVのすべてのレコードを fail にマーク
            recordsForThis.forEach(({record}) => {
              testResults.push({
                alias: record.alias,
                wav: record.filename,
                status: "skipped",
                error: `WAV データが見つかりません: ${wavPath}`,
              });
            });
            processedCount += recordsForThis.length;
            setProgress(processedCount / recordsToProcess.length);
            continue;
          }

          // WAVを一度だけ読み込み＆デコード
          let audioData: Float32Array;
          try {
            const wavArrayBuffer = await wavFile.async("arraybuffer");
            audioData = await extractor.decodeWav(wavArrayBuffer);
          } catch (err) {
            recordsForThis.forEach(({record}) => {
              testResults.push({
                alias: record.alias,
                wav: record.filename,
                status: "error",
                error: `WAV デコード失敗: ${err}`,
              });
            });
            processedCount += recordsForThis.length;
            setProgress(processedCount / recordsToProcess.length);
            continue;
          }

          // グループ内の全レコードを処理（デコード済みのaudioDataを再利用）
          for (const {record, originalIndex} of recordsForThis) {
            if (originalIndex < 3) {
              addLog(`レコード開始[${originalIndex + 1}/${recordsToProcess.length}]: alias=${record.alias}, wav=${record.filename}`);
            }
            const testResult: TestResult = {
              alias: record.alias,
              wav: record.filename,
              status: "success",
            };

            try {
              // メルスペクトログラム計算（デコード済みaudioDataを使用）
              const centerMs = record.offset + record.pre;
              const stop2 = tracker.mark("mel_spectrogram");
              let melSpec: Float32Array;
              try {
                melSpec = await extractor.waveToMelSpectrogramFromAudio(audioData, centerMs);
                stop2();
                testResult.melSpectrogramTimeMs = tracker.getStats("mel_spectrogram")?.avgDuration;
              } catch (err) {
                testResult.status = "error";
                testResult.error = `メルスペクトログラム計算失敗: ${err}`;
                testResults.push(testResult);
                processedCount++;
                continue;
              }

              // 音素条件ベクトル生成
              const stop3 = tracker.mark("condition_vector");
              const phonemes = parseAliasToPhonemes(record.alias);
              let cond: Float32Array;
              if (!phonemes) {
                cond = new Float32Array(TOTAL_COND_DIM); // ダミー
              } else {
                cond = phonemesToConditionVector(phonemes[0], phonemes[1], phonemes[2]);
              }
              stop3();
              testResult.conditionTimeMs = tracker.getStats("condition_vector")?.avgDuration;

              // ONNX 推論
              const stop4 = tracker.mark("inference");
              try {
                const specTensor = new ort.Tensor("float16", float32ArrayToFloat16(melSpec), [1, 128, 980]);
                const condTensor = new ort.Tensor("float16", float32ArrayToFloat16(cond), [1, TOTAL_COND_DIM]);

                const result = await sess.run({
                  spectrogram: specTensor,
                  condition: condTensor,
                });

                stop4();
                testResult.inferenceTimeMs = tracker.getStats("inference")?.avgDuration;

                const output = result[sess.outputNames[0]] as ort.Tensor;
                const outputData = "getData" in output
                  ? await (output as any).getData()
                  : (output as any).data;
                void outputData;
                testResult.status = "success";
              } catch (err) {
                testResult.status = "error";
                testResult.error = `推論失敗: ${err}`;
              }
            } catch (err) {
              testResult.status = "error";
              testResult.error = `予期しないエラー: ${err}`;
            }

            testResults.push(testResult);
            processedCount++;

            // メモリスナップショット記録
            if (processedCount % 5 === 0) {
              tracker.recordMemory();
            }

            // 進度更新
            setProgress(processedCount / recordsToProcess.length);
            if (processedCount % 10 === 0) {
              addLog(`処理済み: ${processedCount}/${recordsToProcess.length}`);
            }

            if (processedCount % 5 === 0) {
              await yieldToUi();
            }
          }
        }

        setResults(testResults);

        // 統計情報を出力
        addLog("\n========== テスト完了 ==========");
        const summary = tracker.getSummary();
        addLog(`総処理時間: ${summary.totalTime.toFixed(2)} ms`);
        addLog(`ピークメモリ: ${summary.peakMemoryMB.toFixed(2)} MB`);

        addLog("\n--- ステップ別統計 ---");
        const melStats = tracker.getStats("mel_spectrogram");
        if (melStats) {
          addLog(
            `メルスペクトログラム: 平均 ${melStats.avgDuration.toFixed(2)}ms, ` +
            `最小 ${melStats.minDuration.toFixed(2)}ms, 最大 ${melStats.maxDuration.toFixed(2)}ms`
          );
        }

        const condStats = tracker.getStats("condition_vector");
        if (condStats) {
          addLog(
            `条件ベクトル: 平均 ${condStats.avgDuration.toFixed(2)}ms, ` +
            `最小 ${condStats.minDuration.toFixed(2)}ms, 最大 ${condStats.maxDuration.toFixed(2)}ms`
          );
        }

        const infStats = tracker.getStats("inference");
        if (infStats) {
          addLog(
            `推論: 平均 ${infStats.avgDuration.toFixed(2)}ms, ` +
            `最小 ${infStats.minDuration.toFixed(2)}ms, 最大 ${infStats.maxDuration.toFixed(2)}ms`
          );
        }

        // 成功/失敗カウント
        const successCount = testResults.filter((r) => r.status === "success").length;
        const errorCount = testResults.filter((r) => r.status === "error").length;
        const skippedCount = testResults.filter((r) => r.status === "skipped").length;
        addLog(`\n成功: ${successCount}, エラー: ${errorCount}, スキップ: ${skippedCount}`);

        // JSON レポート出力
        const report = {
          timestamp: new Date().toISOString(),
          summary,
          testResults,
          trackerData: tracker.toJSON(),
        };

        addLog("\nJSON レポートをコンソールに出力しました");
        console.log("=== JSON Report ===");
        console.log(JSON.stringify(report, null, 2));

        // ダウンロードボタンを有効にするため、results を更新
        setResults(testResults);
      } catch (error) {
        addLog(`❌ モデルロード失敗: ${error}`);
      }
    } catch (error) {
      addLog(`❌ テスト実行エラー: ${error}`);
      LOG.error(`パフォーマンステスト失敗: ${error}`, "PerformanceTestPage");
    } finally {
      // コンソール出力を復元
      console.debug = originalDebug;
      setIsRunning(false);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <input
        type="file"
        onChange={onZipFileChange}
        hidden
        ref={inputRef}
        accept="application/zip"
      />
      <Paper sx={{ p: 2, mb: 2, bgcolor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>
          AI Oto 推論 パフォーマンステスト
        </Typography>
        <Typography variant="caption" color="textSecondary">
          1音階すべての音素に対してメルスペクトログラム計算 → 推論を実行し、パフォーマンスを計測します
        </Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={onZipButtonClick}
          disabled={isRunning}
        >
          ZIPを読み込む
        </Button>
        <Button
          variant="contained"
          onClick={runPerformanceTest}
          disabled={isRunning || !oto || !readZip || targetDir === null}
        >
          {isRunning ? "テスト実行中..." : "テスト開始"}
        </Button>
        <Button
          variant="outlined"
          onClick={downloadLogs}
          disabled={logs.length === 0}
        >
          ログをダウンロード
        </Button>
      </Box>

      {isRunning && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={progress * 100}
            sx={{ width: 50, height: 50 }}
          />
          <Typography>
            進捗: {Math.round(progress * 100)}% ({Math.round(progress * totalRecords)}/
            {totalRecords})
          </Typography>
        </Box>
      )}

      {/* ログパネル */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: "#1e1e1e", color: "#00ff00", maxHeight: 300, overflow: "auto", fontFamily: "monospace", fontSize: 12, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
        {logs.length === 0 ? (
          <Typography sx={{ color: "gray" }}>ログがここに表示されます</Typography>
        ) : (
          logs.map((log, i) => (
            <Typography key={i} sx={{ fontSize: 12, mb: 0.5 }}>
              {log}
            </Typography>
          ))
        )}
      </Paper>

      {/* テスト結果テーブル */}
      {results.length > 0 && (
        <Paper sx={{ p: 2, overflow: "auto" }}>
          <Typography variant="h6" gutterBottom>
            テスト結果 ({results.length}件)
          </Typography>
          <Box sx={{ overflowX: "auto", fontSize: 12 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0", borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: 8, textAlign: "left", borderRight: "1px solid #ddd" }}>
                    Alias
                  </th>
                  <th style={{ padding: 8, textAlign: "left", borderRight: "1px solid #ddd" }}>
                    Status
                  </th>
                  <th style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                    メル(ms)
                  </th>
                  <th style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                    条件(ms)
                  </th>
                  <th style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                    推論(ms)
                  </th>
                  <th style={{ padding: 8, textAlign: "left" }}>
                    エラー
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#fafafa" : "white",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <td style={{ padding: 8, borderRight: "1px solid #ddd" }}>
                      {result.alias}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        borderRight: "1px solid #ddd",
                        color:
                          result.status === "success"
                            ? "green"
                            : result.status === "error"
                            ? "red"
                            : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {result.status}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                      {result.melSpectrogramTimeMs?.toFixed(2) || "-"}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                      {result.conditionTimeMs?.toFixed(2) || "-"}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", borderRight: "1px solid #ddd" }}>
                      {result.inferenceTimeMs?.toFixed(2) || "-"}
                    </td>
                    <td style={{ padding: 8, fontSize: 11, color: "gray" }}>
                      {result.error}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      )}

      <LoadZipDialog
        dialogOpen={zipDialogOpen}
        setDialogOpen={setZipDialogOpen}
        file={readFile}
        setZipFiles={setReadZip}
      />
      <TargetDirDialog
        dialogOpen={targetDirDialogOpen}
        setDialogOpen={setTargetDirDialogOpen}
      />
    </Box>
  );
};
