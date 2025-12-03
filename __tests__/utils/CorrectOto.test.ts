import { describe, it, expect } from "vitest";
import { CorrectTempo, AliasVariant } from "../../src/utils/CorrectOto";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

describe("CorrectOto", () => {
  let dummyOto = new Oto();
  beforeEach(() => {
    dummyOto = new Oto();
    dummyOto.ParseOto(
      "testDir",
      "01_あかきくけこ.wav=あ,1538.320,66.210,-325.620,0.000,0.000\r\n" +
        "01_あかきくけこ.wav=* あ,1574.510,181.000,-284.900,40.000,80.000\r\n" +
        "01_あかきくけこ.wav=か,1936.440,156.070,-404.600,69.000,0.000\r\n" +
        "01_あかきくけこ.wav=き,2466.210,121.540,-370.070,57.140,0.000\r\n" +
        "01_あかきくけこ.wav=く,2963.270,166.890,-395.460,65.310,0.000\r\n" +
        "01_あかきくけこ.wav=け,3460.320,117.910,-390.930,61.680,0.000\r\n" +
        "01_あかきくけこ.wav=こ,3950.110,149.660,-592.290,58.960,0.000\r\n" +
        "02_いさしすせそ.wav=い,1264.400,54.420,-223.130,0.000,0.000\r\n" +
        "02_いさしすせそ.wav=* い,1313.290,118.910,-190.570,40.000,80.000\r\n" +
        "02_いさしすせそ.wav=さ,1553.740,177.780,-367.350,96.150,25.400\r\n" +
        "02_いさしすせそ.wav=し,1967.350,197.730,-407.260,129.710,48.980\r\n" +
        "02_いさしすせそ.wav=す,2438.100,226.760,-487.980,148.750,57.140\r\n" +
        "02_いさしすせそ.wav=せ,2973.250,187.750,-449.880,117.000,44.000\r\n" +
        "02_いさしすせそ.wav=そ,3462.130,213.150,-667.570,116.100,40.820"
    );
  });
  it("dummyOtoの確認", () => {
    expect(dummyOto.GetFileNames("testDir")).toEqual([
      "01_あかきくけこ.wav",
      "02_いさしすせそ.wav",
    ]);
    expect(dummyOto.GetAliases("testDir", "01_あかきくけこ.wav")).toEqual([
      "あ",
      "* あ",
      "か",
      "き",
      "く",
      "け",
      "こ",
    ]);
    expect(dummyOto.GetAliases("testDir", "02_いさしすせそ.wav")).toEqual([
      "い",
      "* い",
      "さ",
      "し",
      "す",
      "せ",
      "そ",
    ]);
    const testRecord = dummyOto.GetRecord(
      "testDir",
      "01_あかきくけこ.wav",
      "* あ"
    );
    expect(testRecord?.alias).toBe("* あ");
    expect(testRecord?.offset).toBe(1574.51);
    expect(testRecord?.pre).toBe(40.0);
    expect(testRecord?.overlap).toBe(80.0);
    expect(testRecord?.velocity).toBe(181.0);
    expect(testRecord?.blank).toBe(-284.9);
  });
  it("CorrectCV: CVエイリアスの補正が正しく行われる", () => {
    // テスト用の引数
    const targetDir = "testDir";
    const aliasVariant = ["CV", "CV"] as AliasVariant[]; // CVエイリアスのみ
    const beforeOffset = 1540; // 変更前のオフセット(ms)
    const afterOffset = 200; // 変更後のオフセット(ms)
    const beforeTempo = 120; // 変更前のテンポ(BPM)
    const afterTempo = 90; // 変更後のテンポ(BPM)

    // 補正後のレコードを取得
    const correctedRecord = dummyOto.GetRecord(
      targetDir,
      "01_あかきくけこ.wav",
      "* あ"
    ) as OtoRecord;

    // CorrectTempoを実行
    CorrectTempo(
      dummyOto,
      targetDir,
      aliasVariant,
      beforeOffset,
      afterOffset,
      beforeTempo,
      afterTempo
    );

    // アサーション
    expect(correctedRecord).not.toBeNull();
    expect(correctedRecord.blank).toBeCloseTo(-379.87, 2);
    expect(correctedRecord.offset).toBeCloseTo(259.35, 2);
    expect(correctedRecord.pre).toBe(40.0);
    expect(correctedRecord.overlap).toBe(80.0);
  });
  it("CorrectVCV: VCVエイリアスの補正が正しく行われる", () => {
    // テスト用の引数
    const targetDir = "testDir";
    const aliasVariant = ["VCV", "VCV"] as AliasVariant[]; // VCVエイリアスのみ
    const beforeOffset = 1540; // 変更前のオフセット(ms)
    const afterOffset = 200; // 変更後のオフセット(ms)
    const beforeTempo = 120; // 変更前のテンポ(BPM)
    const afterTempo = 90; // 変更後のテンポ(BPM)

    // 補正前のレコードを取得し、必要なプロパティをコピー
    const originalRecord = dummyOto.GetRecord(
      targetDir,
      "01_あかきくけこ.wav",
      "* あ"
    ) as OtoRecord;

    // CorrectTempoを実行
    CorrectTempo(
      dummyOto,
      targetDir,
      aliasVariant,
      beforeOffset,
      afterOffset,
      beforeTempo,
      afterTempo
    );

    // 補正後のレコードを取得
    const correctedRecord = dummyOto.GetRecord(
      targetDir,
      "01_あかきくけこ.wav",
      "* あ"
    ) as OtoRecord;

    // アサーション
    expect(correctedRecord).not.toBeNull();
    expect(correctedRecord.offset).toBeCloseTo(246.013, 2);
    expect(correctedRecord.pre).toBeCloseTo(53.33, 2);
    expect(correctedRecord.overlap).toBeCloseTo(106.67, 2);
    expect(correctedRecord.velocity).toBeCloseTo(241.33, 2);
    expect(correctedRecord.blank).toBeCloseTo(-379.87, 2);
  });
  it("CorrectVC: VCエイリアスの補正が正しく行われる", () => {
    // テスト用の引数
    const targetDir = "testDir";
    const aliasVariant = ["VC", "VC"] as AliasVariant[]; // VCエイリアスのみ
    const beforeOffset = 1540; // 変更前のオフセット(ms)
    const afterOffset = 200; // 変更後のオフセット(ms)
    const beforeTempo = 120; // 変更前のテンポ(BPM)
    const afterTempo = 90; // 変更後のテンポ(BPM)

    // 補正前のレコードを取得し、必要なプロパティをコピー
    const originalRecord = dummyOto.GetRecord(
      targetDir,
      "01_あかきくけこ.wav",
      "* あ"
    ) as OtoRecord;

    // CorrectTempoを実行
    CorrectTempo(
      dummyOto,
      targetDir,
      aliasVariant,
      beforeOffset,
      afterOffset,
      beforeTempo,
      afterTempo
    );

    // 補正後のレコードを取得
    const correctedRecord = dummyOto.GetRecord(
      targetDir,
      "01_あかきくけこ.wav",
      "* あ"
    ) as OtoRecord;

    // アサーション
    expect(correctedRecord).not.toBeNull();
    expect(correctedRecord).not.toBeNull();
    expect(correctedRecord.offset).toBeCloseTo(387.843, 3);
    expect(correctedRecord.pre).toBeCloseTo(53.333, 3);
    expect(correctedRecord.overlap).toBeCloseTo(106.667, 3);
    expect(correctedRecord.velocity).toBeCloseTo(194.333, 3);
    expect(correctedRecord.blank).toBeCloseTo(-298.233, 3);
  });
});
