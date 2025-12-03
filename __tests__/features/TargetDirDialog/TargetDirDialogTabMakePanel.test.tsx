import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TabContext } from "@mui/lab";
import React from "react";

import {
  TargetDirDialogTabMakePanel,
  convertVowelsFromIni,
  convertConsonantsFromIni,
  updateStateFromIni,
  buildIniFromState,
} from "../../../src/features/TargetDirDialog/TargetDirDialogTabMakePanel";

// MakeOto関連のモック
vi.mock("../../../src/lib/MakeOtoTemp/MakeOto", () => ({
  MakeOtoSingle: vi.fn(),
  MakeOto: vi.fn(),
}));

// otoProjectStore のモック
vi.mock("../../../src/store/otoProjectStore", () => ({
  useOtoProjectStore: () => ({
    readZip: { "test.wav": new ArrayBuffer(0) },
    targetDir: "test-dir",
    setOto: vi.fn(),
  }),
}));

// モック関数への参照を取得（テスト実行時に）
import { MakeOtoSingle, MakeOto } from "../../../src/lib/MakeOtoTemp/MakeOto";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

// 型アサーション付きでモック関数への参照を取得
const mockMakeOtoSingle = vi.mocked(MakeOtoSingle);
const mockMakeOto = vi.mocked(MakeOto);
// useOtoProjectStoreから直接setOtoのモックを取得
let mockSetOto: ReturnType<typeof vi.fn>;

beforeEach(() => {
  mockSetOto = useOtoProjectStore().setOto as ReturnType<typeof vi.fn>;
});

describe("convertVowelsFromIni", () => {
  it("同じ母音に複数のCVがマップされる場合、カンマ区切りで結合される", () => {
    const input = {
      か: "a",
      が: "a",
      さ: "a",
    };

    const result = convertVowelsFromIni(input);

    expect(result).toEqual([{ vowel: "a", variant: "か,が,さ" }]);
  });

  it("異なる母音に別々のCVがマップされる場合、それぞれ独立した要素になる", () => {
    const input = {
      か: "a",
      き: "i",
      く: "u",
    };

    const result = convertVowelsFromIni(input);

    expect(result).toEqual([
      { vowel: "a", variant: "か" },
      { vowel: "i", variant: "き" },
      { vowel: "u", variant: "く" },
    ]);
  });

  it("混合ケース：一部の母音は複数CV、一部は単一CVがマップされる", () => {
    const input = {
      か: "a",
      が: "a",
      き: "i",
      く: "u",
      ぐ: "u",
    };

    const result = convertVowelsFromIni(input);

    expect(result).toEqual([
      { vowel: "a", variant: "か,が" },
      { vowel: "i", variant: "き" },
      { vowel: "u", variant: "く,ぐ" },
    ]);
  });
});

describe("convertConsonantsFromIni", () => {
  it("同じ子音に複数のCVがマップされる場合、カンマ区切りで結合される", () => {
    const input = {
      か: { consonant: "k", length: 100 },
      き: { consonant: "k", length: 100 },
      く: { consonant: "k", length: 100 },
    };

    const result = convertConsonantsFromIni(input);

    expect(result).toEqual([
      { consonant: "k", variant: "か,き,く", length: 100 },
    ]);
  });

  it("異なる子音に別々のCVがマップされる場合、それぞれ独立した要素になる", () => {
    const input = {
      か: { consonant: "k", length: 100 },
      さ: { consonant: "s", length: 120 },
      た: { consonant: "t", length: 80 },
    };

    const result = convertConsonantsFromIni(input);

    expect(result).toEqual([
      { consonant: "k", variant: "か", length: 100 },
      { consonant: "s", variant: "さ", length: 120 },
      { consonant: "t", variant: "た", length: 80 },
    ]);
  });

  it("混合ケース：一部の子音は複数CV、一部は単一CVがマップされ、lengthは最初の値が使用される", () => {
    const input = {
      か: { consonant: "k", length: 100 },
      き: { consonant: "k", length: 150 }, // この値は無視される
      さ: { consonant: "s", length: 120 },
      た: { consonant: "t", length: 80 },
      ち: { consonant: "t", length: 90 }, // この値は無視される
    };

    const result = convertConsonantsFromIni(input);

    expect(result).toEqual([
      { consonant: "k", variant: "か,き", length: 100 },
      { consonant: "s", variant: "さ", length: 120 },
      { consonant: "t", variant: "た,ち", length: 80 },
    ]);
  });
});

describe("updateStateFromIni", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("iniの各プロパティが対応するsetterに正しく渡される", () => {
    const mockSetters = {
      setOffset: vi.fn(),
      setTempo: vi.fn(),
      setMaxnum: vi.fn(),
      setUnderbar: vi.fn(),
      setBeginingCv: vi.fn(),
      setRequireHead: vi.fn(),
      setRequireVCV: vi.fn(),
      setRequireOnlyConsonant: vi.fn(),
      setVowel: vi.fn(),
      setConsonant: vi.fn(),
      setReplace: vi.fn(),
    };

    const testIni = {
      offset: 500,
      tempo: 140,
      max: 5,
      underbar: true,
      beginingCv: false,
      noHead: true, // setRequireHeadには反転されて渡される
      noVCV: false, // setRequireVCVには反転されて渡される
      onlyConsonant: true,
      vowel: { あ: "a" },
      consonant: { か: { consonant: "k", length: 100 } },
      replace: [["お", "を"]] as Array<[string, string]>,
    };

    updateStateFromIni(testIni, mockSetters);

    // 基本プロパティが正しく呼ばれることを確認
    expect(mockSetters.setOffset).toHaveBeenCalledWith(500);
    expect(mockSetters.setTempo).toHaveBeenCalledWith(140);
    expect(mockSetters.setMaxnum).toHaveBeenCalledWith(5);
    expect(mockSetters.setUnderbar).toHaveBeenCalledWith(true);
    expect(mockSetters.setBeginingCv).toHaveBeenCalledWith(false);
    expect(mockSetters.setRequireHead).toHaveBeenCalledWith(false); // !noHead
    expect(mockSetters.setRequireVCV).toHaveBeenCalledWith(true); // !noVCV
    expect(mockSetters.setRequireOnlyConsonant).toHaveBeenCalledWith(true);
    expect(mockSetters.setReplace).toHaveBeenCalledWith([["お", "を"]]);

    // 変換関数の結果がsetterに渡されることを確認（実際の変換を実行）
    expect(mockSetters.setVowel).toHaveBeenCalledWith([
      { vowel: "a", variant: "あ" },
    ]);
    expect(mockSetters.setConsonant).toHaveBeenCalledWith([
      { consonant: "k", variant: "か", length: 100 },
    ]);
  });
});

describe("buildIniFromState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("基本プロパティが正しくiniに設定される", () => {
    const baseIni = {
      offset: 0,
      tempo: 120,
      max: 3,
      underbar: false,
      beginingCv: false,
      noHead: false,
      noVCV: false,
      onlyConsonant: false,
      vowel: {},
      consonant: {},
      replace: [] as Array<[string, string]>,
    };

    const state = {
      offset: 600,
      tempo: 150,
      maxnum: 8,
      underbar: true,
      beginingCv: true,
      requireHead: false, // iniのnoHeadは true になる
      requireVCV: true, // iniのnoVCVは false になる
      requireOnlyConsonant: true,
      vowel: [{ vowel: "a", variant: "あ" }],
      consonant: [{ consonant: "k", variant: "か", length: 100 }],
      replace: [["お", "を"]] as Array<[string, string]>,
    };

    const result = buildIniFromState(baseIni, state);

    // 基本プロパティの確認
    expect(result.offset).toBe(600);
    expect(result.tempo).toBe(150);
    expect(result.max).toBe(8);
    expect(result.underbar).toBe(true);
    expect(result.beginingCv).toBe(true);
    expect(result.onlyConsonant).toBe(true);
    expect(result.replace).toEqual([["お", "を"]]);

    // boolean値の反転確認
    expect(result.noHead).toBe(true); // !requireHead
    expect(result.noVCV).toBe(false); // !requireVCV
  });

  it("母音変換が正しく実行される", () => {
    const baseIni = {
      offset: 0,
      tempo: 120,
      max: 3,
      underbar: false,
      beginingCv: false,
      noHead: false,
      noVCV: false,
      onlyConsonant: false,
      vowel: {},
      consonant: {},
      replace: [] as Array<[string, string]>,
    };

    const state = {
      offset: 0,
      tempo: 120,
      maxnum: 3,
      underbar: false,
      beginingCv: false,
      requireHead: true,
      requireVCV: true,
      requireOnlyConsonant: false,
      vowel: [
        { vowel: "a", variant: "か,が,さ" },
        { vowel: "i", variant: "き" },
      ],
      consonant: [],
      replace: [] as Array<[string, string]>,
    };

    const result = buildIniFromState(baseIni, state);

    // 母音変換の確認
    expect(result.vowel).toEqual({
      か: "a",
      が: "a",
      さ: "a",
      き: "i",
    });
  });

  it("子音変換が正しく実行される", () => {
    const baseIni = {
      offset: 0,
      tempo: 120,
      max: 3,
      underbar: false,
      beginingCv: false,
      noHead: false,
      noVCV: false,
      onlyConsonant: false,
      vowel: {},
      consonant: {},
      replace: [] as Array<[string, string]>,
    };

    const state = {
      offset: 0,
      tempo: 120,
      maxnum: 3,
      underbar: false,
      beginingCv: false,
      requireHead: true,
      requireVCV: true,
      requireOnlyConsonant: false,
      vowel: [],
      consonant: [
        { consonant: "k", variant: "か,き", length: 100 },
        { consonant: "s", variant: "さ", length: 120 },
      ],
      replace: [] as Array<[string, string]>,
    };

    const result = buildIniFromState(baseIni, state);

    // 子音変換の確認
    expect(result.consonant).toEqual({
      か: { consonant: "k", length: 100 },
      き: { consonant: "k", length: 100 },
      さ: { consonant: "s", length: 120 },
    });
  });

  it("複合ケース：全ての変換が同時に実行される", () => {
    const baseIni = {
      offset: 300,
      tempo: 100,
      max: 2,
      underbar: true,
      beginingCv: true,
      noHead: true,
      noVCV: true,
      onlyConsonant: true,
      vowel: { existing: "e" },
      consonant: { existing: { consonant: "ex", length: 50 } },
      replace: [["old", "new"]] as Array<[string, string]>,
    };

    const state = {
      offset: 700,
      tempo: 180,
      maxnum: 10,
      underbar: false,
      beginingCv: false,
      requireHead: true, // noHead = false
      requireVCV: false, // noVCV = true
      requireOnlyConsonant: false,
      vowel: [
        { vowel: "a", variant: "あ,か" },
        { vowel: "i", variant: "い" },
      ],
      consonant: [
        { consonant: "k", variant: "か", length: 80 },
        { consonant: "s", variant: "さ,し", length: 90 },
      ],
      replace: [
        ["わ", "は"],
        ["お", "を"],
      ] as Array<[string, string]>,
    };

    const result = buildIniFromState(baseIni, state);

    // 基本プロパティ
    expect(result.offset).toBe(700);
    expect(result.tempo).toBe(180);
    expect(result.max).toBe(10);
    expect(result.underbar).toBe(false);
    expect(result.beginingCv).toBe(false);
    expect(result.onlyConsonant).toBe(false);

    // boolean反転
    expect(result.noHead).toBe(false);
    expect(result.noVCV).toBe(true);

    // 変換結果
    expect(result.vowel).toEqual({
      あ: "a",
      か: "a",
      い: "i",
    });

    expect(result.consonant).toEqual({
      か: { consonant: "k", length: 80 },
      さ: { consonant: "s", length: 90 },
      し: { consonant: "s", length: 90 },
    });

    expect(result.replace).toEqual([
      ["わ", "は"],
      ["お", "を"],
    ]);

    // 元のオブジェクトが変更されていることを確認（mutation）
    expect(result).toBe(baseIni);
  });
});

describe("TargetDirDialogTabMakePanel", () => {
  const mockSetDialogOpen = vi.fn();

  const renderWithTabContext = (component: React.ReactElement) => {
    return render(<TabContext value="4">{component}</TabContext>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 各テスト前にモックをリセット
    mockMakeOtoSingle.mockReset();
    mockMakeOto.mockReset();
    if (mockSetOto) {
      mockSetOto.mockReset();
    }
  });

  it("モードがnullの場合、基本要素のみ表示され適切な無効状態になる", () => {
    renderWithTabContext(
      <TargetDirDialogTabMakePanel setDialogOpen={mockSetDialogOpen} />
    );

    // モード選択は表示される
    expect(screen.getByTestId("mode-select")).toBeInTheDocument();

    // multiモード固有の要素は表示されない
    expect(screen.queryByTestId("settings-accordion")).not.toBeInTheDocument();

    // singleモード固有の要素は表示されない
    expect(screen.queryByTestId("analyze-checkbox")).not.toBeInTheDocument();

    // 共通要素は表示される
    expect(
      screen.getByTestId("skip-begining-number-checkbox")
    ).toBeInTheDocument();
    expect(screen.getByTestId("make-button")).toBeInTheDocument();

    // skip-begining-number-checkboxとmake-buttonは無効状態
    // MUIのCheckboxはaria-disabledで確認
    expect(screen.getByTestId("skip-begining-number-checkbox")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
    expect(screen.getByTestId("make-button")).toBeDisabled();
  });

  it("モードがsingleの場合、single固有要素が表示される", async () => {
    renderWithTabContext(
      <TargetDirDialogTabMakePanel setDialogOpen={mockSetDialogOpen} />
    );

    // singleモードを選択 - LoadZipButtonAreaと同じアプローチ
    const hiddenInput = screen.getByDisplayValue("");
    fireEvent.change(hiddenInput, { target: { value: "single" } });

    await waitFor(() => {
      // single固有の要素が表示される
      expect(screen.getByTestId("analyze-checkbox")).toBeInTheDocument();

      // multiモード固有の要素は表示されない
      expect(
        screen.queryByTestId("settings-accordion")
      ).not.toBeInTheDocument();

      // 共通要素は表示され、有効状態
      expect(
        screen.getByTestId("skip-begining-number-checkbox")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("skip-begining-number-checkbox")
      ).not.toHaveAttribute("aria-disabled", "true");
      expect(screen.getByTestId("make-button")).not.toBeDisabled();
    });
  });

  it("モードがmultiの場合、multi固有要素が表示され、アコーディオンが展開可能", async () => {
    renderWithTabContext(
      <TargetDirDialogTabMakePanel setDialogOpen={mockSetDialogOpen} />
    );

    // multiモードを選択 - LoadZipButtonAreaと同じアプローチ
    const hiddenInput = screen.getByDisplayValue("");
    fireEvent.change(hiddenInput, { target: { value: "multi" } });

    await waitFor(() => {
      // multi固有の要素が表示される
      expect(screen.getByTestId("settings-accordion")).toBeInTheDocument();

      // singleモード固有の要素は表示されない
      expect(screen.queryByTestId("analyze-checkbox")).not.toBeInTheDocument();

      // 共通要素は表示され、有効状態
      expect(
        screen.getByTestId("skip-begining-number-checkbox")
      ).not.toHaveAttribute("aria-disabled", "true");
      expect(screen.getByTestId("make-button")).not.toBeDisabled();
    });

    // アコーディオンを展開
    fireEvent.click(screen.getByTestId("settings-accordion-summary"));

    await waitFor(() => {
      // アコーディオン内の要素が表示される
      expect(screen.getByTestId("tempo-input")).toBeInTheDocument();
      expect(screen.getByTestId("offset-input")).toBeInTheDocument();
      expect(screen.getByTestId("maxnum-input")).toBeInTheDocument();
      expect(screen.getByTestId("underbar-checkbox")).toBeInTheDocument();
      expect(screen.getByTestId("begining-cv-checkbox")).toBeInTheDocument();
      expect(screen.getByTestId("require-head-checkbox")).toBeInTheDocument();
      expect(screen.getByTestId("require-vcv-checkbox")).toBeInTheDocument();
      expect(
        screen.getByTestId("require-only-consonant-checkbox")
      ).toBeInTheDocument();
    });
  });

  describe("singleモード固有の機能", () => {
    beforeEach(async () => {
      renderWithTabContext(
        <TargetDirDialogTabMakePanel setDialogOpen={mockSetDialogOpen} />
      );

      // singleモードに設定
      const hiddenInput = screen.getByDisplayValue("");
      fireEvent.change(hiddenInput, { target: { value: "single" } });

      await waitFor(() => {
        expect(screen.getByTestId("analyze-checkbox")).toBeInTheDocument();
      });
    });

    it("analyzeチェックボックスがクリックで状態変更される", async () => {
      const analyzeCheckbox = screen.getByTestId("analyze-checkbox");

      // 初期状態：チェックされていない
      expect(analyzeCheckbox).not.toHaveClass("Mui-checked");

      // クリックしてチェック状態にする
      fireEvent.click(analyzeCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).toHaveClass("Mui-checked");
      });

      // 再度クリックしてチェックを外す
      fireEvent.click(analyzeCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).not.toHaveClass("Mui-checked");
      });
    });

    it("skip-begining-number-checkboxがクリックで状態変更される", async () => {
      const skipCheckbox = screen.getByTestId("skip-begining-number-checkbox");

      // 初期状態：チェックされていない
      expect(skipCheckbox).not.toHaveClass("Mui-checked");

      // クリックしてチェック状態にする
      fireEvent.click(skipCheckbox);

      await waitFor(() => {
        expect(skipCheckbox).toHaveClass("Mui-checked");
      });

      // 再度クリックしてチェックを外す
      fireEvent.click(skipCheckbox);

      await waitFor(() => {
        expect(skipCheckbox).not.toHaveClass("Mui-checked");
      });
    });

    it("両方のチェックボックスが独立して動作する", async () => {
      const analyzeCheckbox = screen.getByTestId("analyze-checkbox");
      const skipCheckbox = screen.getByTestId("skip-begining-number-checkbox");

      // analyzeのみチェック
      fireEvent.click(analyzeCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).toHaveClass("Mui-checked");
        expect(skipCheckbox).not.toHaveClass("Mui-checked");
      });

      // skipもチェック
      fireEvent.click(skipCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).toHaveClass("Mui-checked");
        expect(skipCheckbox).toHaveClass("Mui-checked");
      });

      // analyzeのみチェックを外す
      fireEvent.click(analyzeCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).not.toHaveClass("Mui-checked");
        expect(skipCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("makeボタンクリック時にMakeOtoSingleが正しいパラメータで呼ばれる", async () => {
      // 適切なOtoインスタンスを作成
      const { Oto } = await import("utauoto");
      const mockOtoResult = new Oto();
      mockMakeOtoSingle.mockReturnValue(mockOtoResult);

      // analyze と skipBeginingNumber のチェックボックスを操作
      const analyzeCheckbox = screen.getByTestId("analyze-checkbox");
      const skipCheckbox = screen.getByTestId("skip-begining-number-checkbox");

      // analyzeをチェック
      fireEvent.click(analyzeCheckbox);

      await waitFor(() => {
        expect(analyzeCheckbox).toHaveClass("Mui-checked");
      });

      // skipBeginingNumberをチェック
      fireEvent.click(skipCheckbox);

      await waitFor(() => {
        expect(skipCheckbox).toHaveClass("Mui-checked");
      });

      // makeボタンをクリック
      const makeButton = screen.getByTestId("make-button");
      fireEvent.click(makeButton);

      // MakeOtoSingleが正しいパラメータで呼ばれることを確認
      expect(mockMakeOtoSingle).toHaveBeenCalledWith(
        { "test.wav": new ArrayBuffer(0) }, // readZip
        "test-dir", // targetDir
        true, // skipBeginingNumber
        true // analyze
      );
    });
    it("チェックボックスが未チェックの場合、makeボタンでfalseが渡される", async () => {
      const { Oto } = await import("utauoto");
      const mockOtoResult = new Oto();
      mockMakeOtoSingle.mockReturnValue(mockOtoResult);

      // チェックボックスはデフォルトで未チェックなので、そのままmakeボタンをクリック
      const makeButton = screen.getByTestId("make-button");
      fireEvent.click(makeButton);

      // MakeOtoSingleが正しいパラメータで呼ばれることを確認
      expect(mockMakeOtoSingle).toHaveBeenCalledWith(
        { "test.wav": new ArrayBuffer(0) }, // readZip
        "test-dir", // targetDir
        false, // skipBeginingNumber (未チェック)
        false // analyze (未チェック)
      );
    });
  });

  describe("multiモード固有の機能", () => {
    beforeEach(async () => {
      renderWithTabContext(
        <TargetDirDialogTabMakePanel setDialogOpen={mockSetDialogOpen} />
      );

      // multiモードに設定
      const hiddenInput = screen.getByDisplayValue("");
      fireEvent.change(hiddenInput, { target: { value: "multi" } });

      await waitFor(() => {
        expect(screen.getByTestId("settings-accordion")).toBeInTheDocument();
      });

      // アコーディオンを展開
      fireEvent.click(screen.getByTestId("settings-accordion-summary"));

      await waitFor(() => {
        expect(screen.getByTestId("tempo-input")).toBeInTheDocument();
      });
    });

    it("tempoフィールドが正しく変更される", async () => {
      const tempoInput = screen.getByTestId("tempo-input");
      const inputElement = tempoInput.querySelector("input")!;

      // 初期値を確認（デフォルト値120）
      expect(inputElement).toHaveValue(120);

      // 値を変更
      fireEvent.change(inputElement, { target: { value: "140" } });

      await waitFor(() => {
        expect(inputElement).toHaveValue(140);
      });
    });

    it("offsetフィールドが正しく変更される", async () => {
      const offsetInput = screen.getByTestId("offset-input");
      const inputElement = offsetInput.querySelector("input")!;

      // 初期値を確認（デフォルト値1000）
      expect(inputElement).toHaveValue(1000);

      // 値を変更
      fireEvent.change(inputElement, { target: { value: "500" } });

      await waitFor(() => {
        expect(inputElement).toHaveValue(500);
      });
    });

    it("maxnumフィールドが正しく変更される", async () => {
      const maxnumInput = screen.getByTestId("maxnum-input");
      const inputElement = maxnumInput.querySelector("input")!;

      // 初期値を確認（デフォルト値2）
      expect(inputElement).toHaveValue(2);

      // 値を変更
      fireEvent.change(inputElement, { target: { value: "5" } });

      await waitFor(() => {
        expect(inputElement).toHaveValue(5);
      });
    });

    it("underbarチェックボックスが正しく変更される", async () => {
      const underbarCheckbox = screen.getByTestId("underbar-checkbox");

      // 初期状態：チェックされていない
      expect(underbarCheckbox).not.toHaveClass("Mui-checked");

      // チェックする
      fireEvent.click(underbarCheckbox);

      await waitFor(() => {
        expect(underbarCheckbox).toHaveClass("Mui-checked");
      });

      // チェックを外す
      fireEvent.click(underbarCheckbox);

      await waitFor(() => {
        expect(underbarCheckbox).not.toHaveClass("Mui-checked");
      });
    });

    it("beginingCvチェックボックスが正しく変更される", async () => {
      const beginingCvCheckbox = screen.getByTestId("begining-cv-checkbox");

      // 初期状態：チェックされていない
      expect(beginingCvCheckbox).not.toHaveClass("Mui-checked");

      // チェックする
      fireEvent.click(beginingCvCheckbox);

      await waitFor(() => {
        expect(beginingCvCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("requireHeadチェックボックスが正しく変更される", async () => {
      const requireHeadCheckbox = screen.getByTestId("require-head-checkbox");

      // 初期状態：チェックされていない
      expect(requireHeadCheckbox).not.toHaveClass("Mui-checked");

      // チェックする
      fireEvent.click(requireHeadCheckbox);

      await waitFor(() => {
        expect(requireHeadCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("requireVCVチェックボックスが正しく変更される", async () => {
      const requireVCVCheckbox = screen.getByTestId("require-vcv-checkbox");

      // 初期状態：チェックされていない
      expect(requireVCVCheckbox).not.toHaveClass("Mui-checked");

      // チェックする
      fireEvent.click(requireVCVCheckbox);

      await waitFor(() => {
        expect(requireVCVCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("requireOnlyConsonantチェックボックスが正しく変更される", async () => {
      const requireOnlyConsonantCheckbox = screen.getByTestId("require-only-consonant-checkbox");

      // 初期状態：チェックされていない
      expect(requireOnlyConsonantCheckbox).not.toHaveClass("Mui-checked");

      // チェックする
      fireEvent.click(requireOnlyConsonantCheckbox);

      await waitFor(() => {
        expect(requireOnlyConsonantCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("全てのパラメータが独立して変更され、相互に影響しない", async () => {
      // 全ての入力要素を取得
      const tempoInput = screen.getByTestId("tempo-input").querySelector("input")!;
      const offsetInput = screen.getByTestId("offset-input").querySelector("input")!;
      const maxnumInput = screen.getByTestId("maxnum-input").querySelector("input")!;
      const underbarCheckbox = screen.getByTestId("underbar-checkbox");
      const beginingCvCheckbox = screen.getByTestId("begining-cv-checkbox");
      const requireHeadCheckbox = screen.getByTestId("require-head-checkbox");
      const requireVCVCheckbox = screen.getByTestId("require-vcv-checkbox");
      const requireOnlyConsonantCheckbox = screen.getByTestId("require-only-consonant-checkbox");

      // 全ての値を変更
      fireEvent.change(tempoInput, { target: { value: "180" } });
      fireEvent.change(offsetInput, { target: { value: "800" } });
      fireEvent.change(maxnumInput, { target: { value: "7" } });
      fireEvent.click(underbarCheckbox);
      fireEvent.click(beginingCvCheckbox);
      fireEvent.click(requireHeadCheckbox);
      fireEvent.click(requireVCVCheckbox);
      fireEvent.click(requireOnlyConsonantCheckbox);

      // 全ての変更が独立して適用されていることを確認
      await waitFor(() => {
        expect(tempoInput).toHaveValue(180);
        expect(offsetInput).toHaveValue(800);
        expect(maxnumInput).toHaveValue(7);
        expect(underbarCheckbox).toHaveClass("Mui-checked");
        expect(beginingCvCheckbox).toHaveClass("Mui-checked");
        expect(requireHeadCheckbox).toHaveClass("Mui-checked");
        expect(requireVCVCheckbox).toHaveClass("Mui-checked");
        expect(requireOnlyConsonantCheckbox).toHaveClass("Mui-checked");
      });

      // 一部の値のみを変更して、他に影響しないことを確認
      fireEvent.change(tempoInput, { target: { value: "200" } });
      fireEvent.click(underbarCheckbox); // チェックを外す

      await waitFor(() => {
        // 変更した値のみ更新される
        expect(tempoInput).toHaveValue(200);
        expect(underbarCheckbox).not.toHaveClass("Mui-checked");

        // 他の値は変更されない
        expect(offsetInput).toHaveValue(800);
        expect(maxnumInput).toHaveValue(7);
        expect(beginingCvCheckbox).toHaveClass("Mui-checked");
        expect(requireHeadCheckbox).toHaveClass("Mui-checked");
        expect(requireVCVCheckbox).toHaveClass("Mui-checked");
        expect(requireOnlyConsonantCheckbox).toHaveClass("Mui-checked");
      });
    });

    it("makeボタンクリック時に初期値でMakeOtoが正しいパラメータで呼ばれる", async () => {
      // 適切なOtoインスタンスを作成
      const { Oto } = await import("utauoto");
      const mockOtoResult = new Oto();
      mockMakeOto.mockReturnValue(mockOtoResult);

      // makeボタンをクリック（全て初期値）
      const makeButton = screen.getByTestId("make-button");
      fireEvent.click(makeButton);

      // MakeOtoが正しいパラメータで呼ばれることを確認
      expect(mockMakeOto).toHaveBeenCalledTimes(1);
      
      const calledArgs = mockMakeOto.mock.calls[0];
      const [ini, fileKeys, targetDir, skipBeginingNumber] = calledArgs;

      // 基本パラメータの確認
      expect(ini.tempo).toBe(120);
      expect(ini.offset).toBe(1000);
      expect(ini.max).toBe(2);
      expect(ini.underbar).toBe(false);
      expect(ini.beginingCv).toBe(false);
      expect(ini.noHead).toBe(true); // !requireHead (初期値false)
      expect(ini.noVCV).toBe(true); // !requireVCV (初期値false)
      expect(ini.onlyConsonant).toBe(false);
      expect(ini.vowel).toEqual({});
      expect(ini.consonant).toEqual({});
      expect(ini.replace).toEqual([]);

      // その他のパラメータ
      expect(fileKeys).toEqual(["test.wav"]);
      expect(targetDir).toBe("test-dir");
      expect(skipBeginingNumber).toBe(false); // 初期値
    });

    it("makeボタンクリック時に変更された値でMakeOtoが正しいパラメータで呼ばれる", async () => {
      // 適切なOtoインスタンスを作成
      const { Oto } = await import("utauoto");
      const mockOtoResult = new Oto();
      mockMakeOto.mockReturnValue(mockOtoResult);

      // 全ての値を変更
      const tempoInput = screen.getByTestId("tempo-input").querySelector("input")!;
      const offsetInput = screen.getByTestId("offset-input").querySelector("input")!;
      const maxnumInput = screen.getByTestId("maxnum-input").querySelector("input")!;
      const underbarCheckbox = screen.getByTestId("underbar-checkbox");
      const beginingCvCheckbox = screen.getByTestId("begining-cv-checkbox");
      const requireHeadCheckbox = screen.getByTestId("require-head-checkbox");
      const requireVCVCheckbox = screen.getByTestId("require-vcv-checkbox");
      const requireOnlyConsonantCheckbox = screen.getByTestId("require-only-consonant-checkbox");
      const skipBeginingNumberCheckbox = screen.getByTestId("skip-begining-number-checkbox");

      // 値を変更
      fireEvent.change(tempoInput, { target: { value: "140" } });
      fireEvent.change(offsetInput, { target: { value: "500" } });
      fireEvent.change(maxnumInput, { target: { value: "5" } });
      fireEvent.click(underbarCheckbox);
      fireEvent.click(beginingCvCheckbox);
      fireEvent.click(requireHeadCheckbox);
      fireEvent.click(requireVCVCheckbox);
      fireEvent.click(requireOnlyConsonantCheckbox);
      fireEvent.click(skipBeginingNumberCheckbox);

      await waitFor(() => {
        expect(tempoInput).toHaveValue(140);
        expect(offsetInput).toHaveValue(500);
        expect(maxnumInput).toHaveValue(5);
        expect(underbarCheckbox).toHaveClass("Mui-checked");
        expect(beginingCvCheckbox).toHaveClass("Mui-checked");
        expect(requireHeadCheckbox).toHaveClass("Mui-checked");
        expect(requireVCVCheckbox).toHaveClass("Mui-checked");
        expect(requireOnlyConsonantCheckbox).toHaveClass("Mui-checked");
        expect(skipBeginingNumberCheckbox).toHaveClass("Mui-checked");
      });

      // makeボタンをクリック
      const makeButton = screen.getByTestId("make-button");
      fireEvent.click(makeButton);

      // MakeOtoが正しいパラメータで呼ばれることを確認
      expect(mockMakeOto).toHaveBeenCalledTimes(1);
      
      const calledArgs = mockMakeOto.mock.calls[0];
      const [ini, fileKeys, targetDir, skipBeginingNumber] = calledArgs;

      // 変更された値の確認
      expect(ini.tempo).toBe("140");
      expect(ini.offset).toBe("500");
      expect(ini.max).toBe("5");
      expect(ini.underbar).toBe(true);
      expect(ini.beginingCv).toBe(true);
      expect(ini.noHead).toBe(false); // !requireHead (変更後true)
      expect(ini.noVCV).toBe(false); // !requireVCV (変更後true)
      expect(ini.onlyConsonant).toBe(true);
      expect(ini.vowel).toEqual({});
      expect(ini.consonant).toEqual({});
      expect(ini.replace).toEqual([]);

      // その他のパラメータ
      expect(fileKeys).toEqual(["test.wav"]);
      expect(targetDir).toBe("test-dir");
      expect(skipBeginingNumber).toBe(true); // 変更後
    });
  });
});
