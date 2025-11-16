import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MakePanelVowelAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelVowelAccordion";

describe("MakePanelVowelAccordion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("vowelプロパティのデータが正しく描画される", async () => {
    const mockSetVowel = vi.fn();
    const mockVowelData = [
      { vowel: "a", variant: "あ,か,さ" },
      { vowel: "i", variant: "い,き,し" },
      { vowel: "u", variant: "う,く,す" }
    ];

    render(
      <MakePanelVowelAccordion
        vowel={mockVowelData}
        setVowel={mockSetVowel}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      // 1番目の母音データ(a, あ,か,さ)が正しく表示されることを確認
      const symbolInput0 = screen.getByTestId('vowel-symbol-input-0').querySelector('input');
      const variantInput0 = screen.getByTestId('vowel-variant-input-0').querySelector('input');
      expect(symbolInput0).toHaveDisplayValue('a');
      expect(variantInput0).toHaveDisplayValue('あ,か,さ');
    });

    // 2番目と3番目の母音データも確認
    const symbolInput1 = screen.getByTestId('vowel-symbol-input-1').querySelector('input');
    const variantInput1 = screen.getByTestId('vowel-variant-input-1').querySelector('input');
    expect(symbolInput1).toHaveDisplayValue('i');
    expect(variantInput1).toHaveDisplayValue('い,き,し');

    const symbolInput2 = screen.getByTestId('vowel-symbol-input-2').querySelector('input');
    const variantInput2 = screen.getByTestId('vowel-variant-input-2').querySelector('input');
    expect(symbolInput2).toHaveDisplayValue('u');
    expect(variantInput2).toHaveDisplayValue('う,く,す');

    // 追加ボタンが表示されることを確認
    const addButton = screen.getByTestId('vowel-add-button');
    expect(addButton).toBeInTheDocument();
  });

  it("symbolInputの値を変更した場合、setVowelが正しく呼ばれる", async () => {
    const mockSetVowel = vi.fn();
    const mockVowelData = [
      { vowel: "a", variant: "あ,か,さ" },
      { vowel: "i", variant: "い,き,し" }
    ];

    render(
      <MakePanelVowelAccordion
        vowel={mockVowelData}
        setVowel={mockSetVowel}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const symbolInput0 = screen.getByTestId('vowel-symbol-input-0').querySelector('input');
      expect(symbolInput0).toBeInTheDocument();
    });

    // 1番目のsymbolInputの値を変更
    const symbolInput0 = screen.getByTestId('vowel-symbol-input-0').querySelector('input');
    expect(symbolInput0).not.toBeNull();
    fireEvent.change(symbolInput0!, { target: { value: 'e' } });

    // setVowelが正しい引数で呼ばれることを確認
    expect(mockSetVowel).toHaveBeenCalledWith([
      { vowel: "e", variant: "あ,か,さ" }, // 1番目のvowelが変更されている
      { vowel: "i", variant: "い,き,し" }  // 2番目は変更されていない
    ]);
  });

  it("variantInputの値を変更した場合、setVowelが正しく呼ばれる", async () => {
    const mockSetVowel = vi.fn();
    const mockVowelData = [
      { vowel: "a", variant: "あ,か,さ" },
      { vowel: "i", variant: "い,き,し" }
    ];

    render(
      <MakePanelVowelAccordion
        vowel={mockVowelData}
        setVowel={mockSetVowel}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const variantInput0 = screen.getByTestId('vowel-variant-input-0').querySelector('input');
      expect(variantInput0).toBeInTheDocument();
    });

    // 2番目のvariantInputの値を変更
    const variantInput1 = screen.getByTestId('vowel-variant-input-1').querySelector('input');
    expect(variantInput1).not.toBeNull();
    fireEvent.change(variantInput1!, { target: { value: 'う,く,す,ぬ' } });

    // setVowelが正しい引数で呼ばれることを確認
    expect(mockSetVowel).toHaveBeenCalledWith([
      { vowel: "a", variant: "あ,か,さ" },     // 1番目は変更されていない
      { vowel: "i", variant: "う,く,す,ぬ" }   // 2番目のvariantが変更されている
    ]);
  });

  it("addButtonが押された場合、setVowelが新しい空の要素と共に呼ばれる", async () => {
    const mockSetVowel = vi.fn();
    const mockVowelData = [
      { vowel: "a", variant: "あ,か,さ" },
      { vowel: "i", variant: "い,き,し" }
    ];

    render(
      <MakePanelVowelAccordion
        vowel={mockVowelData}
        setVowel={mockSetVowel}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const addButton = screen.getByTestId('vowel-add-button');
      expect(addButton).toBeInTheDocument();
    });

    // 追加ボタンをクリック
    const addButton = screen.getByTestId('vowel-add-button');
    fireEvent.click(addButton);

    // setVowelが正しい引数で呼ばれることを確認
    expect(mockSetVowel).toHaveBeenCalledWith([
      { vowel: "a", variant: "あ,か,さ" }, // 既存の1番目の要素
      { vowel: "i", variant: "い,き,し" }, // 既存の2番目の要素
      { vowel: "", variant: "" }          // 新しく追加された空の要素
    ]);
  });

  // TODO: 他のテストケースを追加予定
});
