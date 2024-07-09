import { Oto } from "utauoto";
import {
  ParseIni,
  ReplaceAlias,
  SetVowel,
  CheckUnderbar,
  GetFilename,
  GetRange,
  MakeOnsetConsonantCluster,
  MakeCodaConsonantCluster,
  MakeCV,
  MakeVCV,
  MakeCVVC,
} from "../src/Lib/MakeOtoTempIni";

describe("MakeOtoTempIniのテスト", () => {
  test("ReplaceAlias", () => {
    const ini = ParseIni("[REPLACE]\r\na=あ\r\ni=い");
    expect(ini.replace).toEqual([
      ["a", "あ"],
      ["i", "い"],
    ]);
    expect(ReplaceAlias(ini, "a")).toBe("あ");
    expect(ReplaceAlias(ini, "i")).toBe("い");
    expect(ReplaceAlias(ini, "ai")).toBe("あい");
    expect(ReplaceAlias(ini, "aiu")).toBe("あいu");
  });
  test("SetVowel", () => {
    const ini = ParseIni("[VOWEL]\r\na=あ,か,ゃ");
    expect(ini.vowel["あ"]).toBe("a");
    expect(ini.vowel["か"]).toBe("a");
    expect(ini.vowel["ゃ"]).toBe("a");
    expect(SetVowel(ini, "あ")).toBe("a");
    expect(SetVowel(ini, "か")).toBe("a");
    expect(SetVowel(ini, "きゃ")).toBe("a");
    expect(SetVowel(ini, "い")).toBe("-");
  });
  test("CheckUnderbar_iniTrue", () => {
    const ini = ParseIni("[UNDER]\r\n1\r\n");
    expect(ini.underbar).toBe(true);
    const [begin, beats, prev_vowel] = CheckUnderbar(ini, 1, "_a_b", 1, "a");
    expect(begin).toBe(1);
    expect(beats).toBe(1);
    expect(prev_vowel).toBe("a");
    const [begin2, beats2, prev_vowel2] = CheckUnderbar(ini, 2, "_a_b", 2, "a");
    expect(begin2).toBe(3);
    expect(beats2).toBe(3);
    expect(prev_vowel2).toBe("-");
  });
  test("CheckUnderbar_iniFalse", () => {
    const ini = ParseIni("[UNDER]\r\n0\r\n");
    expect(ini.underbar).toBe(false);
    const [begin, beats, prev_vowel] = CheckUnderbar(ini, 1, "_a_b", 1, "a");
    expect(begin).toBe(1);
    expect(beats).toBe(1);
    expect(prev_vowel).toBe("a");
    const [begin2, beats2, prev_vowel2] = CheckUnderbar(ini, 2, "_a_b", 2, "a");
    expect(begin2).toBe(3);
    expect(beats2).toBe(2);
    expect(prev_vowel2).toBe("a");
  });
  test("GetFileName", () => {
    expect(GetFilename("a/_あかきくけこ.wav", "a", false)).toBe(
      "_あかきくけこ"
    );
    expect(GetFilename("a/01_あかきくけこ.wav", "a", false)).toBe(
      "01_あかきくけこ"
    );
    expect(GetFilename("a/01_あかきくけこ.wav", "a", true)).toBe(
      "_あかきくけこ"
    );
  });
});

describe("GetRange", () => {
  const ini = ParseIni(
    "[CONSONANT]\r\nky=きゃ,き,きゅ,きぇ,きょ=50\r\nk=か,く,け,こ=40"
  );
  test("CheckSetting", () => {
    expect(ini.consonant["きゃ"]).toEqual({ consonant: "ky", length: 50 });
    expect(ini.consonant["き"]).toEqual({ consonant: "ky", length: 50 });
    expect(ini.consonant["きゅ"]).toEqual({ consonant: "ky", length: 50 });
    expect(ini.consonant["きぇ"]).toEqual({ consonant: "ky", length: 50 });
    expect(ini.consonant["きょ"]).toEqual({ consonant: "ky", length: 50 });
    expect(ini.consonant["か"]).toEqual({ consonant: "k", length: 40 });
    expect(ini.consonant["く"]).toEqual({ consonant: "k", length: 40 });
    expect(ini.consonant["け"]).toEqual({ consonant: "k", length: 40 });
    expect(ini.consonant["こ"]).toEqual({ consonant: "k", length: 40 });
  });
  test("1character1", () => {
    const [begin, end, beats, prev_vowel] = GetRange(
      ini,
      1,
      "_かかきくけこ",
      1,
      "-"
    );
    expect(begin).toBe(1);
    expect(end).toBe(2);
    expect(beats).toBe(1);
    expect(prev_vowel).toBe("-");
  });
  test("1character2", () => {
    const [begin2, end2, beats2, prev_vowel2] = GetRange(
      ini,
      2,
      "_かかきくけこ",
      2,
      "a"
    );
    expect(begin2).toBe(2);
    expect(end2).toBe(3);
    expect(beats2).toBe(2);
    expect(prev_vowel2).toBe("a");
  });
  test("2character1", () => {
    const [begin3, end3, beats3, prev_vowel3] = GetRange(
      ini,
      1,
      "_きゃきゃききゅきぇきょ",
      1,
      "a"
    );
    expect(begin3).toBe(1);
    expect(end3).toBe(3);
    expect(beats3).toBe(1);
    expect(prev_vowel3).toBe("a");
  });
  test("2character2", () => {
    const [begin4, end4, beats4, prev_vowel4] = GetRange(
      ini,
      3,
      "_きゃきゃききゅきぇきょ",
      2,
      "a"
    );
    expect(begin4).toBe(3);
    expect(end4).toBe(5);
    expect(beats4).toBe(2);
    expect(prev_vowel4).toBe("a");
  });
  test("skipUnknownCharacter", () => {
    const [begin5, end5, beats5, prev_vowel5] = GetRange(
      ini,
      1,
      "_さかきくけこ",
      1,
      "a"
    );
    expect(begin5).toBe(2);
    expect(end5).toBe(3);
    expect(beats5).toBe(1);
    expect(prev_vowel5).toBe("a");
  });
  test("skipAll", () => {
    const [begin6, end6, beats6, prev_vowel6] = GetRange(
      ini,
      1,
      "_ささしすせそ",
      1,
      "a"
    );
    expect(begin6).toBe(7);
    expect(end6).toBe(7);
    expect(beats6).toBe(1);
    expect(prev_vowel6).toBe("a");
  });
  test("underbar", () => {
    const [begin7, end7, beats7, prev_vowel7] = GetRange(
      ini,
      1,
      "_さ_か",
      1,
      "a"
    );
    expect(begin7).toBe(3);
    expect(end7).toBe(4);
    expect(beats7).toBe(2);
    expect(prev_vowel7).toBe("-");
  });
  test("underbarSkip", () => {
    ini.underbar = false;
    const [begin8, end8, beats8, prev_vowel8] = GetRange(
      ini,
      1,
      "_さ_か",
      1,
      "a"
    );
    expect(begin8).toBe(3);
    expect(end8).toBe(4);
    expect(beats8).toBe(1);
    expect(prev_vowel8).toBe("a");
  });
});

describe("MakeOnsetConsonantCluster", () => {
  const ini = ParseIni("");
  ini.offset = 1000;
  test("simple", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    MakeOnsetConsonantCluster(
      ini,
      oto,
      "a",
      "b.wav",
      "c",
      600,
      1,
      300,
      100,
      450,
      -700,
      "a",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "c")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "c");
    if (record) {
      expect(record.offset).toBe(700);
      expect(record.overlap).toBe(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBe(-700);
    }
  });
  test("checkMax", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.max = 2;
    for (let i = 0; i < 3; i++) {
      MakeOnsetConsonantCluster(
        ini,
        oto,
        "a",
        "b.wav",
        "c",
        600,
        1,
        300,
        100,
        450,
        -700,
        "a",
        aliasCounter
      );
    }
    expect(oto.HasOtoRecord("a", "b.wav", "c")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "c2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "c3")).toBe(false);
  });
  test("noMax", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.max = 0;
    for (let i = 0; i < 100; i++) {
      MakeOnsetConsonantCluster(
        ini,
        oto,
        "a",
        "b.wav",
        "c",
        600,
        1,
        300,
        100,
        450,
        -700,
        "a",
        aliasCounter
      );
    }
    expect(oto.HasOtoRecord("a", "b.wav", "c")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "c99")).toBe(true);
  });
  test("checkHead", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    MakeOnsetConsonantCluster(
      ini,
      oto,
      "a",
      "b.wav",
      "c",
      600,
      3,
      300,
      100,
      450,
      -700,
      "-",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "- c")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "- c");
    if (record) {
      expect(record.offset).toBe(1900);
      expect(record.overlap).toBe(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBe(-700);
    }
  });
});

describe("MakeCodaConsonantCluster", () => {
  const ini = ParseIni("");
  ini.max = 2;
  ini.offset = 1000;
  ini.consonant["s"] = { consonant: "s", length: 100 };
  ini.consonant["st"] = { consonant: "-", length: 120 };
  ini.consonant["str"] = { consonant: "-", length: 150 };
  test("2character", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    MakeCodaConsonantCluster(
      ini,
      oto,
      "a",
      "b.wav",
      "st",
      600,
      1,
      300,
      100,
      450,
      -700,
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "s t")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "s t");
    if (record) {
      expect(record.offset).toBe(700);
      expect(record.overlap).toBe(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBe(-700);
    }
  });
  test("3character", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    MakeCodaConsonantCluster(
      ini,
      oto,
      "a",
      "b.wav",
      "str",
      600,
      1,
      300,
      100,
      450,
      -700,
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "s tr")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "s tr");
    if (record) {
      expect(record.offset).toBe(700);
      expect(record.overlap).toBe(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBe(-700);
    }
  });

  test("maxCheck", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.max = 2;
    for (let i = 0; i < 3; i++) {
      MakeCodaConsonantCluster(
        ini,
        oto,
        "a",
        "b.wav",
        "st",
        600,
        1,
        300,
        100,
        450,
        -700,
        aliasCounter
      );
    }
    expect(oto.HasOtoRecord("a", "b.wav", "s t")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s t2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s t3")).toBe(false);
  });
});

describe("MAKECVのテスト", () => {
  const ini = ParseIni("");
  ini.offset = 1000;
  ini.consonant["か"] = { consonant: "k", length: 50 };
  ini.consonant["さ"] = { consonant: "s", length: 120 };
  test("noHead", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.max = 2;
    ini.noHead = true;
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
  });
  test("SimpleCV", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.beginingCv = true;
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "か")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "か");
    if (record) {
      expect(record.offset).toBe(950);
      expect(record.overlap).toBeCloseTo(50 / 3);
      expect(record.pre).toBe(50);
      expect(record.velocity).toBe(75);
      expect(record.blank).toBeCloseTo(-600 - 50 / 3);
    }
  });
  test("CheckMax", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.beginingCv = true;
    ini.max = 2;
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "か")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "か2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "か3")).toBe(false);
  });
  test("NoBeginingCV", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.beginingCv = false;
    MakeCV(ini, oto, "a", "b.wav", "か", 600, 1, aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "- か")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "- か");
    if (record) {
      expect(record.offset).toBe(950);
      expect(record.overlap).toBeCloseTo(50 / 3);
      expect(record.pre).toBe(50);
      expect(record.velocity).toBe(75);
      expect(record.blank).toBeCloseTo(-600 - 50 / 3);
    }
  });
  test("OtherParams", () => {
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.beginingCv = true;
    MakeCV(ini, oto, "a", "b.wav", "さ", 600, 2, aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "さ");
    if (record) {
      expect(record.offset).toBe(1600 - 120);
      expect(record.overlap).toBeCloseTo(40);
      expect(record.pre).toBe(120);
      expect(record.velocity).toBe(180);
      expect(record.blank).toBeCloseTo(-600 - 40);
    }
  });
});

describe("MakeVCVのテスト", () => {
  test("noHead", () => {
    /** noheadかつprev_vowelが-の場合生成されない。 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = true;
    ini.offset = 1000;
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      1,
      300,
      100,
      450,
      -700,
      "-",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "あ")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "- あ")).toBe(false);
  });
  test("allowHeadWithNoVCV", () => {
    /** noVCVがtrueでもnoHeadがtrueなら先頭音は生成される。 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.noVCV = true;
    ini.beginingCv = false;
    ini.offset = 1000;
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      1,
      300,
      100,
      450,
      -700,
      "-",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "あ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "- あ")).toBe(false);
    const record = oto.GetRecord("a", "b.wav", "あ");
    if (record) {
      expect(record.offset).toBe(700);
      expect(record.overlap).toBeCloseTo(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBeCloseTo(-700);
    }
  });
  test("allowHeadWithNoVCVCheckMaxAlias", () => {
    /** noVCVがtrueでもnoHeadがtrueの場合の重複制御確認 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noHead = false;
    ini.noVCV = true;
    ini.beginingCv = false;
    ini.offset = 1000;
    ini.max = 2;
    for (let i = 0; i < 3; i++) {
      MakeVCV(
        ini,
        oto,
        "a",
        "b.wav",
        "あ",
        600,
        1,
        300,
        100,
        450,
        -700,
        "-",
        aliasCounter
      );
    }
    expect(oto.HasOtoRecord("a", "b.wav", "あ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "あ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "あ3")).toBe(false);
  });
  test("noVCV", () => {
    /** noVCVの場合、[- CV]と[V CV]は生成されない。 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noVCV = true;
    ini.offset = 1000;
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      1,
      300,
      100,
      450,
      -700,
      "-",
      aliasCounter
    );
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      2,
      300,
      100,
      450,
      -700,
      "a",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "-")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "a あ")).toBe(false);
  });
  test("VCV", () => {
    /** noVCVがfalseの場合、[- CV]と[V CV]が生成される。 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noVCV = false;
    ini.offset = 1000;
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      1,
      300,
      100,
      450,
      -700,
      "-",
      aliasCounter
    );
    MakeVCV(
      ini,
      oto,
      "a",
      "b.wav",
      "あ",
      600,
      2,
      300,
      100,
      450,
      -700,
      "a",
      aliasCounter
    );
    expect(oto.HasOtoRecord("a", "b.wav", "- あ")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "- あ");
    if (record) {
      expect(record.offset).toBe(700);
      expect(record.overlap).toBeCloseTo(100);
      expect(record.pre).toBe(300);
      expect(record.velocity).toBe(450);
      expect(record.blank).toBeCloseTo(-700);
    }
    expect(oto.HasOtoRecord("a", "b.wav", "a あ")).toBe(true);
    const record2 = oto.GetRecord("a", "b.wav", "あ");
    if (record2) {
      expect(record2.offset).toBe(1300);
      expect(record2.overlap).toBeCloseTo(100);
      expect(record2.pre).toBe(300);
      expect(record2.velocity).toBe(450);
      expect(record2.blank).toBeCloseTo(-700);
    }
  });
  test("VCVCheckMax", () => {
    /** noVCVがfalseの場合の重複制御 */
    const ini = ParseIni("");
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.noVCV = false;
    ini.offset = 1000;
    ini.max = 2;
    for (let i = 0; i < 3; i++) {
      MakeVCV(
        ini,
        oto,
        "a",
        "b.wav",
        "あ",
        600,
        1,
        300,
        100,
        450,
        -700,
        "-",
        aliasCounter
      );
    }
    expect(oto.HasOtoRecord("a", "b.wav", "- あ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "- あ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "- あ3")).toBe(false);
  });
});

describe("MakeCVVCのテスト", () => {
  const ini = ParseIni("");
  ini.offset = 1000;
  ini.consonant["さ"] = { consonant: "s", length: 120 };
  test("CVVC", () => {
    /** 通常のCVVC生成 */
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = false;
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(false);
    const record = oto.GetRecord("a", "b.wav", "さ");
    if (record) {
      expect(record.offset).toBe(1600 - 120);
      expect(record.overlap).toBeCloseTo(40);
      expect(record.pre).toBe(120);
      expect(record.velocity).toBe(180);
      expect(record.blank).toBeCloseTo(-600 - 40);
    }
    const record2 = oto.GetRecord("a", "b.wav", "a s");
    if (record2) {
      expect(record2.offset).toBe(1600 - 120 - 300);
      expect(record2.overlap).toBeCloseTo(100);
      expect(record2.pre).toBe(300);
      expect(record2.velocity).toBe(360);
      expect(record2.blank).toBeCloseTo(-390);
    }
  });
  test("CVVCWithOnlyConsonant", () => {
    /** 通常のCVVC生成 + 子音単独音素 */
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = true;
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    const record = oto.GetRecord("a", "b.wav", "さ");
    if (record) {
      expect(record.offset).toBe(1600 - 120);
      expect(record.overlap).toBeCloseTo(40);
      expect(record.pre).toBe(120);
      expect(record.velocity).toBe(180);
      expect(record.blank).toBeCloseTo(-600 - 40);
    }
    const record2 = oto.GetRecord("a", "b.wav", "a s");
    if (record2) {
      expect(record2.offset).toBe(1600 - 120 - 300);
      expect(record2.overlap).toBeCloseTo(100);
      expect(record2.pre).toBe(300);
      expect(record2.velocity).toBe(360);
      expect(record2.blank).toBeCloseTo(-390);
    }
    const record3 = oto.GetRecord("a", "b.wav", "s");
    if (record3) {
      expect(record3.offset).toBe(1600 - 120);
      expect(record3.overlap).toBeCloseTo(36);
      expect(record3.pre).toBe(12);
      expect(record3.velocity).toBe(60);
      expect(record3.blank).toBeCloseTo(-120);
    }
  });
  test("SimpleMaxCheck", () => {
    /** 通常のCVVC生成 + 子音単独音素 */
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = true;
    ini.max = 2;
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "a s3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "s3")).toBe(false);
  });
  test("VCMaxCheck", () => {
    /** 別途VCが追加されていても、VCとonly consonantが正常に生成されることの確認*/
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = false;
    ini.max = 2;
    ini.consonant["す"] = { consonant: "s", length: 120 };
    MakeCVVC(ini, oto, "a", "b.wav", "す", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    ini.onlyConsonant = true;
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "a s3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "s3")).toBe(false);
  });
  test("CVMaxCheck", () => {
    /** 別途CVが追加されていても、VCとonly consonantが正常に生成されることの確認*/
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = true;
    ini.max = 2;
    MakeCV(ini, oto, "a", "b.wav", "さ", 600, 2, aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "a s3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "s3")).toBe(false);
  });
  test("VCMaxCheck", () => {
    /** 別途Cが追加されていても、VCとonly consonantが正常に生成されることの確認*/
    const oto = new Oto();
    const aliasCounter: { [key: string]: number } = {};
    ini.onlyConsonant = true;
    ini.consonant["す"] = { consonant: "s", length: 120 };
    ini.max = 2;
    MakeCVVC(ini, oto, "a", "b.wav", "す", 600, 2, 300, 100, "i", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    MakeCVVC(ini, oto, "a", "b.wav", "さ", 600, 2, 300, 100, "a", aliasCounter);
    expect(oto.HasOtoRecord("a", "b.wav", "さ")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "a s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "s2")).toBe(true);
    expect(oto.HasOtoRecord("a", "b.wav", "さ3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "a s3")).toBe(false);
    expect(oto.HasOtoRecord("a", "b.wav", "s3")).toBe(false);
  });
});
