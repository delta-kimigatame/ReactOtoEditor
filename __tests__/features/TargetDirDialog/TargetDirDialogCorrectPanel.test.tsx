import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import {
  TargetDirDialogCorrectPanel,
  SetDefaultAliasVariant,
} from "../../../src/features/TargetDirDialog/TargetDirDialogCorrectPanel";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import OtoRecord from "utauoto/dist/OtoRecord";

describe("SetDefaultAliasVariant", () => {
  it("すべての右ブランクが正の場合、hasPositiveBlankがtrueになる", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,3,4,5\r\nCV.wav=* あ,6,7,8,9,10\r\n_VCV.wav=a う,11,12,13,14,15\r\nVC.wav=a k,16,17,18,19,20"
    );
    const mockSetAliasVariant = vi.fn();
    const mockSetHasPositiveBlank = vi.fn();

    SetDefaultAliasVariant(
      oto,
      "A3",
      mockSetAliasVariant,
      mockSetHasPositiveBlank
    );

    // setAliasVariantが呼ばれることを確認
    expect(mockSetAliasVariant).toHaveBeenCalledTimes(1);
    const aliasVariantArgument = mockSetAliasVariant.mock.calls[0][0];

    // エイリアス種類が正しく推定されることを確認
    expect(aliasVariantArgument).toEqual(["CV", "CV", "VCV", "VC"]);

    // positiveBlankがtrueで呼ばれることを確認
    expect(mockSetHasPositiveBlank).toHaveBeenCalledWith(true);
  });
  it("すべての右ブランクが負の場合、hasPositiveBlankがfalseになる", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* あ,6,7,-8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15\r\nVC.wav=a k,16,17,-18,19,20"
    );
    const mockSetAliasVariant = vi.fn();
    const mockSetHasPositiveBlank = vi.fn();

    SetDefaultAliasVariant(
      oto,
      "A3",
      mockSetAliasVariant,
      mockSetHasPositiveBlank
    );

    // setAliasVariantが呼ばれることを確認
    expect(mockSetAliasVariant).toHaveBeenCalledTimes(1);
    const aliasVariantArgument = mockSetAliasVariant.mock.calls[0][0];

    // エイリアス種類が正しく推定されることを確認
    expect(aliasVariantArgument).toEqual(["CV", "CV", "VCV", "VC"]);

    // positiveBlankがtrueで呼ばれることを確認
    expect(mockSetHasPositiveBlank).toHaveBeenCalledWith(false);
  });

  it("1つだけの右ブランクが正の場合、hasPositiveBlankがtrueになる", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* あ,6,7,8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15\r\nVC.wav=a k,16,17,-18,19,20"
    );
    const mockSetAliasVariant = vi.fn();
    const mockSetHasPositiveBlank = vi.fn();

    SetDefaultAliasVariant(
      oto,
      "A3",
      mockSetAliasVariant,
      mockSetHasPositiveBlank
    );

    // setAliasVariantが呼ばれることを確認
    expect(mockSetAliasVariant).toHaveBeenCalledTimes(1);
    const aliasVariantArgument = mockSetAliasVariant.mock.calls[0][0];

    // エイリアス種類が正しく推定されることを確認
    expect(aliasVariantArgument).toEqual(["CV", "CV", "VCV", "VC"]);

    // positiveBlankがtrueで呼ばれることを確認（1つでも正の値があればtrue）
    expect(mockSetHasPositiveBlank).toHaveBeenCalledWith(true);
  });
});

describe("TargetDirDialogCorrectPanel", () => {
  const mockSetDialogOpen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアをリセット
    useOtoProjectStore.getState().setOto(null);
  });

  it("UI描画確認：初期状態でisCorrectOffsetがfalse", () => {
    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // 常に表示されるべき要素
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
    expect(screen.getByTestId("correct-offset-checkbox")).toBeInTheDocument();

    // 表示されないべき要素
    expect(screen.queryByTestId("before-offset-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("after-offset-input")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("correct-tempo-checkbox")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("before-tempo-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("after-tempo-input")).not.toBeInTheDocument();
  });

  it("UI描画確認：オフセット補正ありでpositiveBlankがtrue", async () => {
    // positiveBlankがtrueになるOtoデータを事前に設定
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正をチェック
    const offsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(offsetCheckbox);

    // 表示されるべき要素
    expect(screen.getByTestId("before-offset-input")).toBeInTheDocument();
    expect(screen.getByTestId("after-offset-input")).toBeInTheDocument();

    // エラーメッセージが表示される
    expect(screen.getByText(/hasPositiveBlankError/)).toBeInTheDocument();

    // テンポ関連UIは表示されない
    expect(
      screen.queryByTestId("correct-tempo-checkbox")
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId("before-tempo-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("after-tempo-input")).not.toBeInTheDocument();
  });

  it("UI描画確認：オフセット補正ありでpositiveBlankがfalseかつテンポ補正なし", () => {
    // positiveBlankがfalseになるOtoデータを事前に設定
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正をチェック
    const offsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(offsetCheckbox);

    // 表示されるべき要素
    expect(screen.getByTestId("before-offset-input")).toBeInTheDocument();
    expect(screen.getByTestId("after-offset-input")).toBeInTheDocument();
    expect(screen.getByTestId("correct-tempo-checkbox")).toBeInTheDocument();

    // エラーメッセージは表示されない
    expect(screen.queryByText(/hasPositiveBlankError/)).not.toBeInTheDocument();

    // テンポ補正がチェックされていないのでテンポ入力は表示されない
    expect(screen.queryByTestId("before-tempo-input")).not.toBeInTheDocument();
    expect(screen.queryByTestId("after-tempo-input")).not.toBeInTheDocument();
  });

  it("UI描画確認：オフセット補正ありでpositiveBlankがfalseかつテンポ補正あり", () => {
    // positiveBlankがfalseになるOtoデータを事前に設定
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正をチェック
    const offsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(offsetCheckbox);

    // テンポ補正もチェック
    const tempoCheckbox = screen.getByTestId("correct-tempo-checkbox");
    fireEvent.click(tempoCheckbox);

    // すべての要素が表示される
    expect(screen.getByTestId("before-offset-input")).toBeInTheDocument();
    expect(screen.getByTestId("after-offset-input")).toBeInTheDocument();
    expect(screen.getByTestId("correct-tempo-checkbox")).toBeInTheDocument();
    expect(screen.getByTestId("before-tempo-input")).toBeInTheDocument();
    expect(screen.getByTestId("after-tempo-input")).toBeInTheDocument();

    // エラーメッセージは表示されない
    expect(screen.queryByText(/hasPositiveBlankError/)).not.toBeInTheDocument();
  });

  it("correct-offsetチェックボックスの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");

    // 初期状態：未チェック
    expect(correctOffsetCheckbox).not.toHaveClass("Mui-checked");

    // クリックしてチェック
    fireEvent.click(correctOffsetCheckbox);
    expect(correctOffsetCheckbox).toHaveClass("Mui-checked");

    // 再度クリックしてチェック解除
    fireEvent.click(correctOffsetCheckbox);
    expect(correctOffsetCheckbox).not.toHaveClass("Mui-checked");
  });

  it("before-offset入力フィールドの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正を有効にして入力フィールドを表示
    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(correctOffsetCheckbox);

    const beforeOffsetInput = screen
      .getByTestId("before-offset-input")
      .querySelector("input") as HTMLInputElement;

    // 初期値：0
    expect(beforeOffsetInput.value).toBe("0");

    // 値を変更
    fireEvent.change(beforeOffsetInput, { target: { value: "100" } });
    expect(beforeOffsetInput.value).toBe("100");

    // 別の値に変更
    fireEvent.change(beforeOffsetInput, { target: { value: "250" } });
    expect(beforeOffsetInput.value).toBe("250");
  });

  it("after-offset入力フィールドの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正を有効にして入力フィールドを表示
    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(correctOffsetCheckbox);

    const afterOffsetInput = screen
      .getByTestId("after-offset-input")
      .querySelector("input") as HTMLInputElement;

    // 初期値：0
    expect(afterOffsetInput.value).toBe("0");

    // 値を変更
    fireEvent.change(afterOffsetInput, { target: { value: "150" } });
    expect(afterOffsetInput.value).toBe("150");

    // 別の値に変更
    fireEvent.change(afterOffsetInput, { target: { value: "300" } });
    expect(afterOffsetInput.value).toBe("300");
  });

  it("correct-tempoチェックボックスの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正を先に有効にしてテンポチェックボックスを表示
    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(correctOffsetCheckbox);

    const correctTempoCheckbox = screen.getByTestId("correct-tempo-checkbox");

    // 初期状態：未チェック
    expect(correctTempoCheckbox).not.toHaveClass("Mui-checked");

    // クリックしてチェック
    fireEvent.click(correctTempoCheckbox);
    expect(correctTempoCheckbox).toHaveClass("Mui-checked");

    // 再度クリックしてチェック解除
    fireEvent.click(correctTempoCheckbox);
    expect(correctTempoCheckbox).not.toHaveClass("Mui-checked");
  });

  it("before-tempo入力フィールドの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正とテンポ補正を有効にして入力フィールドを表示
    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(correctOffsetCheckbox);

    const correctTempoCheckbox = screen.getByTestId("correct-tempo-checkbox");
    fireEvent.click(correctTempoCheckbox);

    const beforeTempoInput = screen
      .getByTestId("before-tempo-input")
      .querySelector("input") as HTMLInputElement;

    // 初期値：0
    expect(beforeTempoInput.value).toBe("0");

    // 値を変更
    fireEvent.change(beforeTempoInput, { target: { value: "120" } });
    expect(beforeTempoInput.value).toBe("120");

    // 別の値に変更
    fireEvent.change(beforeTempoInput, { target: { value: "140" } });
    expect(beforeTempoInput.value).toBe("140");
  });

  it("after-tempo入力フィールドの変更確認", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

    // オフセット補正とテンポ補正を有効にして入力フィールドを表示
    const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
    fireEvent.click(correctOffsetCheckbox);

    const correctTempoCheckbox = screen.getByTestId("correct-tempo-checkbox");
    fireEvent.click(correctTempoCheckbox);

    const afterTempoInput = screen
      .getByTestId("after-tempo-input")
      .querySelector("input") as HTMLInputElement;

    // 初期値：0
    expect(afterTempoInput.value).toBe("0");

    // 値を変更
    fireEvent.change(afterTempoInput, { target: { value: "130" } });
    expect(afterTempoInput.value).toBe("130");

    // 別の値に変更
    fireEvent.change(afterTempoInput, { target: { value: "160" } });
    expect(afterTempoInput.value).toBe("160");
  });

  // OnCorrectClick
  describe("OnCorrectClick", () => {
    it("isCorrectOffsetがfalseの場合：補正処理が実行されない", () => {
      const mockSetDialogOpen = vi.fn();
      const oto = new Oto();
      oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
      useOtoProjectStore.getState().setOto(oto);
      useOtoProjectStore.getState().setTargetDir("A3");

      render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

      // オフセット補正をチェックしない（初期状態のまま）
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // setDialogOpenが呼ばれることを確認
      expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
    });

    it("isCorrectOffsetがtrueでisCorrectTempoがfalseの場合：オフセットのみ補正が実行される", () => {
      const mockSetDialogOpen = vi.fn();
      const oto = new Oto();
      oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
      useOtoProjectStore.getState().setOto(oto);
      useOtoProjectStore.getState().setTargetDir("A3");

      render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

      // オフセット補正のみをチェック
      const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
      fireEvent.click(correctOffsetCheckbox);

      // オフセット値を設定
      const beforeOffsetInput = screen.getByTestId("before-offset-input").querySelector('input') as HTMLInputElement;
      const afterOffsetInput = screen.getByTestId("after-offset-input").querySelector('input') as HTMLInputElement;
      
      fireEvent.change(beforeOffsetInput, { target: { value: "100" } });
      fireEvent.change(afterOffsetInput, { target: { value: "150" } });

      // テンポ補正はチェックしない
      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // setDialogOpenが呼ばれることを確認
      expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
    });

    it("isCorrectTempoがtrueでhasPositiveBlankがfalseの場合：テンポ補正が実行される", () => {
      const mockSetDialogOpen = vi.fn();
      const oto = new Oto();
      oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5"); // 負のブランクでhasPositiveBlank = false
      useOtoProjectStore.getState().setOto(oto);
      useOtoProjectStore.getState().setTargetDir("A3");

      render(<TargetDirDialogCorrectPanel setDialogOpen={mockSetDialogOpen} />);

      // オフセット補正をチェック
      const correctOffsetCheckbox = screen.getByTestId("correct-offset-checkbox");
      fireEvent.click(correctOffsetCheckbox);

      // テンポ補正もチェック
      const correctTempoCheckbox = screen.getByTestId("correct-tempo-checkbox");
      fireEvent.click(correctTempoCheckbox);

      // オフセット値とテンポ値を設定
      const beforeOffsetInput = screen.getByTestId("before-offset-input").querySelector('input') as HTMLInputElement;
      const afterOffsetInput = screen.getByTestId("after-offset-input").querySelector('input') as HTMLInputElement;
      const beforeTempoInput = screen.getByTestId("before-tempo-input").querySelector('input') as HTMLInputElement;
      const afterTempoInput = screen.getByTestId("after-tempo-input").querySelector('input') as HTMLInputElement;
      
      fireEvent.change(beforeOffsetInput, { target: { value: "100" } });
      fireEvent.change(afterOffsetInput, { target: { value: "150" } });
      fireEvent.change(beforeTempoInput, { target: { value: "120" } });
      fireEvent.change(afterTempoInput, { target: { value: "140" } });

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // setDialogOpenが呼ばれることを確認
      expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
    });
  });
});
