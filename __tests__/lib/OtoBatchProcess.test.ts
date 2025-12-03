import { describe, it, expect } from "vitest";
import * as BP from "../../src/lib/OtoBatchProcess";
import { Oto } from "utauoto";
import JSZip from "jszip";
import { GenerateWave, Wave } from "utauwav";

const createOto = (alias: string = "a") => {
  const oto = new Oto();
  oto.ParseOto("A3", `CV.wav=${alias},1,2,-3,4,5`);
  return oto;
};

const createZip = () => {
  const zip = new JSZip();
  zip.file("A3/CV.wav", "dummy");
  return zip;
};

describe("OtoBatchProcess", () => {
  it("WaveNotFound: wavファイルが見つからない場合、そのotoのレコードは削除される。", () => {
    //zip内に存在しないwavファイルと存在するファイルを指定した2行のoto.iniを作成
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,1,2,-3,4,5`);
    oto.ParseOto("A3", `CV2.wav=b,1,2,-3,4,5`);

    const zip = createZip();
    BP.WaveNotFound(oto, "A3", zip.files);
    expect(oto.GetFileNames("A3")).toEqual(["CV.wav"]);
    expect(oto.GetFileNames("A3")).not.toEqual(["CV2.wav"]);
  });

  it("RecordNotFound: recordが見つからない場合、空のレコードが作成される。", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV2.wav=b,1,2,-3,4,5`);
    const zip = createZip();
    BP.RecordNotFound(oto, "A3", zip.files);
    expect(oto.GetFileNames("A3")).toContain("CV.wav");
    expect(oto.GetFileNames("A3")).toContain("CV2.wav");
    //作成されたCV.wavの初期値確認
    const record = oto.GetRecord("A3", "CV.wav", "");
    //recordが非null
    expect(record).not.toBeNull();
    //recordの各パラメータが0であることを確認
    expect(record?.offset).toBe(0);
    expect(record?.velocity).toBe(0);
    expect(record?.pre).toBe(0);
    expect(record?.overlap).toBe(0);
    expect(record?.blank).toBe(0);
  });

  it("NumberingDuplicationAlias: 番号重複エイリアスが追加される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=atest,1,2,-3,4,5`);
    oto.ParseOto("A3", `CV2.wav=atest,1,2,-3,4,5`);
    oto.ParseOto("A3", `CV3.wav=atest,1,2,-3,4,5`);
    BP.NumberingDuplicationAlias(oto, "A3", "test", 2);
    // 1つ目のエイリアスは変更されない。
    expect(oto.GetAliases("A3", "CV.wav")).toContain("atest");
    // 2つ目は番号付きに変更される。この際連番の場所は、一致する文字と除外する文字の間
    expect(oto.GetAliases("A3", "CV2.wav")).toContain("a2test");
    expect(oto.GetAliases("A3", "CV2.wav")).not.toContain("atest");
    // 最大で2つまでなので、3つ目は存在しない
    expect(oto.GetAliases("A3", "CV3.wav")).not.toContain("a3test");
    expect(oto.GetAliases("A3", "CV3.wav")).not.toContain("atest");
  });

  it("LimitedNumber: 指定数以上のエイリアスが削除される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=atest,1,2,-3,4,5`);
    oto.ParseOto("A3", `CV2.wav=a2test,1,2,-3,4,5`);
    oto.ParseOto("A3", `CV3.wav=a3test,1,2,-3,4,5`);
    BP.LimitedNumber(oto, "A3", "test", 2);
    // 1つ目と2つ目はエイリアスは削除されない
    expect(oto.GetAliases("A3", "CV.wav")).toContain("atest");
    expect(oto.GetAliases("A3", "CV2.wav")).toContain("a2test");
    // 最大で2つまでなので、3つ目は削除されている。
    expect(oto.GetAliases("A3", "CV3.wav")).not.toContain("a3test");
  });

  it("NegativeBlank: blankが負の場合0になる", async() => {
    const wavData = Array(44100).fill(0);
    //ダミーのwavファイルを作成する。
    const wav = GenerateWave(44100, 16, wavData);
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,1,2,300,4,5`);
    oto.ParseOto("A3", `CV.wav=b,1,2,-300,4,5`);
    const zip = new JSZip();
    zip.file("A3/CV.wav", wav.Output());
    //実行前の値は300msであることを確認
    const record = oto.GetRecord("A3", "CV.wav", "a");
    expect(record?.blank).toBe(300);
    await BP.NegativeBlank(oto, "A3", zip.files);
    // もともと負の数だった値は変更されない。
    const negativeRecord = oto.GetRecord("A3", "CV.wav", "b");
    expect(negativeRecord?.blank).toBe(-300);
    // 正のブランク値はノート末尾からのms、負のブランク値はoffsetからのmsを負の数で表したものなので、-699になることが期待される。
    const newRecord = oto.GetRecord("A3", "CV.wav", "a");
    expect(newRecord?.blank).toBe(-699);
  });

  it("ForceOverlapRate: overlapが強制的に変更される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,1,2,300,45,5`);
    const record = oto.GetRecord("A3", "CV.wav", "a");
    expect(record?.pre).toBe(45);
    expect(record?.overlap).toBe(5);
    BP.ForceOverlapRate(oto, "A3");
    // overlapがpreの1/3になることを確認
    expect(record?.overlap).toBe(15);
  });

  it("RemoveSurfix: サフィックスが削除される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=atest,1,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=btest,1,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=ctest,1,2,300,45,5`);
    BP.RemoveSurfix(oto, "A3", "test");
    // サフィックスが削除されていること
    expect(oto.GetAliases("A3", "CV.wav")).toContain("a");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("b");
    expect(oto.GetAliases("A3", "CV.wav")).not.toContain("atest");
    expect(oto.GetAliases("A3", "CV.wav")).not.toContain("btest");
    // A4のレコードは影響を受けていないこと
    expect(oto.GetAliases("A4", "CV.wav")).toContain("ctest");
  });

  it("AddSurfix: サフィックスが追加される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,1,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,1,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,1,2,300,45,5`);
    BP.AddSurfix(oto, "A3", "test");
    // サフィックス付きrecordが存在すること
    expect(oto.GetAliases("A3", "CV.wav")).toContain("atest");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("btest");
    // 元のレコードが存在しないこと
    expect(oto.GetAliases("A3", "CV.wav")).not.toContain("a");
    expect(oto.GetAliases("A3", "CV.wav")).not.toContain("b");
    // A4のレコードは影響を受けていないこと
    expect(oto.GetAliases("A4", "CV.wav")).toContain("c");
  });

  it("AddParams: パラメータが追加される(offsetの場合)", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.AddParams(oto, "A3", "offset", 123);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(1つ目のパラメータに123が加算されていること)
    expect(recorda?.offset).toBe(133);
    expect(recordb?.offset).toBe(143);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.offset).toBe(30);
  });

  it("AddParams: パラメータが追加される(velocityの場合)", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.AddParams(oto, "A3", "velocity", 123);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(2つ目のパラメータに123が加算されていること)
    expect(recorda?.velocity).toBe(125);
    expect(recordb?.velocity).toBe(125);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.velocity).toBe(2);
  });

  it("AddParams: パラメータが追加される(blankの場合)", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.AddParams(oto, "A3", "blank", 123);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(3つ目のパラメータに123が加算されていること)
    expect(recorda?.blank).toBe(423);
    expect(recordb?.blank).toBe(423);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.blank).toBe(300);
  });
  it("AddParams: パラメータが追加される(preの場合)", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.AddParams(oto, "A3", "preutter", 123);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(4つ目のパラメータに123が加算されていること)
    expect(recorda?.pre).toBe(168);
    expect(recordb?.pre).toBe(168);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.pre).toBe(45);
  });
  it("AddParams: パラメータが追加される(overlapの場合)", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.AddParams(oto, "A3", "overlap", 123);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(5つ目のパラメータに123が加算されていること)
    expect(recorda?.overlap).toBe(128);
    expect(recordb?.overlap).toBe(128);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.overlap).toBe(5);
  });

  it("ChangeParams: パラメータが変更される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=a,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=b,20,2,300,45,5`);
    oto.ParseOto("A4", `CV.wav=c,30,2,300,45,5`);
    BP.ChangeParams(oto, "A3", "offset", 456);
    const recorda = oto.GetRecord("A3", "CV.wav", "a");
    const recordb = oto.GetRecord("A3", "CV.wav", "b");
    // オフセット値(3つ目のパラメータが456に変更されていること)
    expect(recorda?.offset).toBe(456);
    expect(recordb?.offset).toBe(456);
    // A4のレコードは影響を受けていないこと
    const recordc = oto.GetRecord("A4", "CV.wav", "c");
    expect(recordc?.offset).toBe(30);
  });

  it("AliasComplement: エイリアスが補完される", () => {
    const oto = new Oto();
    oto.ParseOto("A3", `CV.wav=お,10,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=じ,20,2,300,45,5`);
    oto.ParseOto("A3", `CV.wav=じゃ,20,2,300,45,5`);//拗音も対応
    oto.ParseOto("A3", `CV.wav=ず,20,2,300,45,5`);
    BP.AliasComplement(oto, "A3");
    // を,ぢ,づが補間されている
    expect(oto.GetAliases("A3", "CV.wav")).toContain("を");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("ぢ");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("ぢゃ");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("づ");
    //元のエイリアスも残っている
    expect(oto.GetAliases("A3", "CV.wav")).toContain("お");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("じ");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("じゃ");
    expect(oto.GetAliases("A3", "CV.wav")).toContain("ず");
  });
});
