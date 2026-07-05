/**
 * ブラウザでメルスペクトログラムを計算するユーティリティ
 */
import { WaveAnalyse } from "utauwav";

export class MelSpectrogramExtractor {
  private sampleRate: number = 44100;
  private nFft: number = 1024;
  private hopLength: number; // 1ms
  private nMels: number = 128;
  private fMin: number = 0;
  private fMax: number | null = null;
  private decoderContext: BaseAudioContext | null = null;
  private waveAnalyse: WaveAnalyse;

  constructor(sampleRate: number = 44100) {
    this.sampleRate = sampleRate;
    this.hopLength = Math.floor(sampleRate * 0.001); // 1ms
    this.fMax = sampleRate / 2; // Nyquist
    this.waveAnalyse = new WaveAnalyse();
  }

  /**
   * WAV ArrayBuffer をモノラル Float32Array にデコード
   */
  async decodeWav(wavArrayBuffer: ArrayBuffer): Promise<Float32Array> {
    const decoder = this.getDecoderContext();
    const audioBuffer = await decoder.decodeAudioData(wavArrayBuffer.slice(0));

    // モノラル化
    const mono = audioBuffer.getChannelData(0);
    return new Float32Array(mono);
  }

  /**
   * デコード用コンテキストを使い回して、AudioContext の乱立を防ぐ
   */
  private getDecoderContext(): BaseAudioContext {
    if (this.decoderContext) {
      return this.decoderContext;
    }

    if (typeof window.OfflineAudioContext !== "undefined") {
      this.decoderContext = new window.OfflineAudioContext(1, 1, this.sampleRate);
      return this.decoderContext;
    }

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.decoderContext = new AudioCtx();
    return this.decoderContext;
  }

  /**
   * 指定時刻付近のウィンドウを切り出す
   * @param audioData デコード済みオーディオ
   * @param centerMs 中心時刻（ミリ秒）
   * @param windowMs ウィンドウサイズ（ミリ秒）
   */
  extractWindow(
    audioData: Float32Array,
    centerMs: number,
    windowMs: number = 600
  ): Float32Array {
    const centerSample = Math.round((centerMs / 1000) * this.sampleRate);
    const halfWindowSamples = Math.round((windowMs / 1000 / 2) * this.sampleRate);

    const startSample = centerSample - halfWindowSamples;
    const endSample = centerSample + halfWindowSamples;

    const windowSize = halfWindowSamples * 2;
    const window = new Float32Array(windowSize);

    // パディング処理
    const validStart = Math.max(0, -startSample);
    const validEnd = Math.min(audioData.length - startSample, windowSize);

    if (validStart < validEnd) {
      window.set(audioData.slice(Math.max(0, startSample), Math.min(audioData.length, endSample)), validStart);
    }

    return window;
  }

  /**
   * Rust/WASM から返る frame-major フラット mel データを [targetNMels, targetNFrames] にリサイズ
   */
  private resizeFlatMelToTargetShape(
    melFlat: Float32Array,
    frames: number,
    nMels: number,
    targetShape: [number, number]
  ): Float32Array {
    const [targetNMels, targetNFrames] = targetShape;

    // 転置: frame-major [frames × nMels] → mel-major [nMels × frames]
    const melMajor = new Float32Array(nMels * frames);
    for (let m = 0; m < nMels; m++) {
      for (let f = 0; f < frames; f++) {
        melMajor[m * frames + f] = melFlat[f * nMels + m];
      }
    }

    // 双線形補間
    const result = new Float32Array(targetNMels * targetNFrames);
    const srcH = nMels;
    const srcW = frames;
    const dstH = targetNMels;
    const dstW = targetNFrames;

    const scaleY = srcH > 1 ? (srcH - 1) / Math.max(dstH - 1, 1) : 0;
    const scaleX = srcW > 1 ? (srcW - 1) / Math.max(dstW - 1, 1) : 0;

    for (let y = 0; y < dstH; y++) {
      const srcY = scaleY * y;
      const y0 = Math.floor(srcY);
      const y1 = Math.min(y0 + 1, srcH - 1);
      const wy = srcY - y0;

      for (let x = 0; x < dstW; x++) {
        const srcX = scaleX * x;
        const x0 = Math.floor(srcX);
        const x1 = Math.min(x0 + 1, srcW - 1);
        const wx = srcX - x0;

        const v00 = melMajor[y0 * srcW + x0];
        const v01 = melMajor[y0 * srcW + x1];
        const v10 = melMajor[y1 * srcW + x0];
        const v11 = melMajor[y1 * srcW + x1];

        const top = v00 + (v01 - v00) * wx;
        const bottom = v10 + (v11 - v10) * wx;
        result[y * dstW + x] = top + (bottom - top) * wy;
      }
    }

    return result;
  }

  /**
   * メイン: WAV → メルスペクトログラム（デシベル）
   * @param wavArrayBuffer WAV ファイルのバイナリデータ
   * @param centerMs 中心時刻（ミリ秒）
   * @returns [128, 980] の Float32Array（デシベルスケール）
   */
  async waveToMelSpectrogram(
    wavArrayBuffer: ArrayBuffer,
    centerMs: number
  ): Promise<Float32Array> {
    // 1. WAV デコード
    const audioData = await this.decodeWav(wavArrayBuffer);

    // 2. ウィンドウ切り出し
    const windowData = this.extractWindow(audioData, centerMs, 600);

    // 3. メルスペクトログラム計算 (Rust/WASM)
    const { mel, frames } = this.waveAnalyse.melSpectrogramLinearFlat(
      windowData as unknown as Array<number>,
      this.sampleRate,
      this.nFft,
      this.hopLength,
      this.nMels,
      this.fMin,
      this.fMax ?? this.sampleRate / 2,
      "hamming",
      this.hopLength,
      0.97,
      true,
      1e-10
    );

    // 4. [128, 980] にリサイズ
    return this.resizeFlatMelToTargetShape(mel, frames, this.nMels, [128, 980]);
  }

  /**
   * デコード済みオーディオデータからメルスペクトログラムを計算
   * 複数レコードで同じWAVを処理する場合、この方法で decodeの再実行を避けられる
   * @param audioData デコード済みオーディオデータ
   * @param centerMs 中心時刻（ミリ秒）
   * @returns [128, 980] の Float32Array（デシベルスケール）
   */
  async waveToMelSpectrogramFromAudio(
    audioData: Float32Array,
    centerMs: number
  ): Promise<Float32Array> {
    // 1. ウィンドウ切り出し
    const t1 = performance.now();
    const windowData = this.extractWindow(audioData, centerMs, 600);
    const windowTime = performance.now() - t1;

    // 2. メルスペクトログラム計算 (Rust/WASM: FFT + mel filterbank + dB 変換を一括処理)
    const t2 = performance.now();
    const { mel, frames } = this.waveAnalyse.melSpectrogramLinearFlat(
      windowData as unknown as Array<number>,
      this.sampleRate,
      this.nFft,
      this.hopLength,
      this.nMels,
      this.fMin,
      this.fMax ?? this.sampleRate / 2,
      "hamming",
      this.hopLength,
      0.97,
      true,
      1e-10
    );
    const melTime = performance.now() - t2;

    // 3. [128, 980] にリサイズ
    const t3 = performance.now();
    const resized = this.resizeFlatMelToTargetShape(mel, frames, this.nMels, [128, 980]);
    const resizeTime = performance.now() - t3;

    console.debug(`[MelSpectrogram Breakdown]`, {
      window: windowTime.toFixed(2),
      mel: melTime.toFixed(2),
      resize: resizeTime.toFixed(2),
      total: (windowTime + melTime + resizeTime).toFixed(2),
    });

    return resized;
  }
}
