import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MakePanelConsonantAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelConsonantAccordion";

describe("MakePanelConsonantAccordion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("consonantプロパティのデータが正しく描画される", async () => {
    const mockSetConsonant = vi.fn();
    const mockConsonantData = [
      { consonant: "k", variant: "か,き,く", length: 100 },
      { consonant: "s", variant: "さ,し,す", length: 150 },
      { consonant: "t", variant: "た,ち,つ", length: 200 }
    ];

    render(
      <MakePanelConsonantAccordion
        consonant={mockConsonantData}
        setConsonant={mockSetConsonant}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      // 1番目の子音データ(k, か,き,く, 100)が正しく表示されることを確認
      const symbolInput0 = screen.getByTestId('consonant-symbol-input-0').querySelector('input');
      const variantInput0 = screen.getByTestId('consonant-variant-input-0').querySelector('input');
      const lengthInput0 = screen.getByTestId('consonant-length-input-0').querySelector('input');
      expect(symbolInput0).toHaveDisplayValue('k');
      expect(variantInput0).toHaveDisplayValue('か,き,く');
      expect(lengthInput0).toHaveDisplayValue('100');
    });

    // 2番目と3番目の子音データも確認
    const symbolInput1 = screen.getByTestId('consonant-symbol-input-1').querySelector('input');
    const variantInput1 = screen.getByTestId('consonant-variant-input-1').querySelector('input');
    const lengthInput1 = screen.getByTestId('consonant-length-input-1').querySelector('input');
    expect(symbolInput1).toHaveDisplayValue('s');
    expect(variantInput1).toHaveDisplayValue('さ,し,す');
    expect(lengthInput1).toHaveDisplayValue('150');

    const symbolInput2 = screen.getByTestId('consonant-symbol-input-2').querySelector('input');
    const variantInput2 = screen.getByTestId('consonant-variant-input-2').querySelector('input');
    const lengthInput2 = screen.getByTestId('consonant-length-input-2').querySelector('input');
    expect(symbolInput2).toHaveDisplayValue('t');
    expect(variantInput2).toHaveDisplayValue('た,ち,つ');
    expect(lengthInput2).toHaveDisplayValue('200');

    // 追加ボタンが表示されることを確認
    const addButton = screen.getByTestId('consonant-add-button');
    expect(addButton).toBeInTheDocument();
  });

  it("symbolInputの値を変更した場合、setConsonantが正しく呼ばれる", async () => {
    const mockSetConsonant = vi.fn();
    const mockConsonantData = [
      { consonant: "k", variant: "か,き,く", length: 100 },
      { consonant: "s", variant: "さ,し,す", length: 150 }
    ];

    render(
      <MakePanelConsonantAccordion
        consonant={mockConsonantData}
        setConsonant={mockSetConsonant}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const symbolInput0 = screen.getByTestId('consonant-symbol-input-0').querySelector('input');
      expect(symbolInput0).toBeInTheDocument();
    });

    // 1番目のsymbolInputの値を変更
    const symbolInput0 = screen.getByTestId('consonant-symbol-input-0').querySelector('input');
    expect(symbolInput0).not.toBeNull();
    fireEvent.change(symbolInput0!, { target: { value: 'g' } });

    // setConsonantが正しい引数で呼ばれることを確認
    expect(mockSetConsonant).toHaveBeenCalledWith([
      { consonant: "g", variant: "か,き,く", length: 100 }, // 1番目のconsonantが変更されている
      { consonant: "s", variant: "さ,し,す", length: 150 }  // 2番目は変更されていない
    ]);
  });

  it("variantInputの値を変更した場合、setConsonantが正しく呼ばれる", async () => {
    const mockSetConsonant = vi.fn();
    const mockConsonantData = [
      { consonant: "k", variant: "か,き,く", length: 100 },
      { consonant: "s", variant: "さ,し,す", length: 150 }
    ];

    render(
      <MakePanelConsonantAccordion
        consonant={mockConsonantData}
        setConsonant={mockSetConsonant}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const variantInput0 = screen.getByTestId('consonant-variant-input-0').querySelector('input');
      expect(variantInput0).toBeInTheDocument();
    });

    // 2番目のvariantInputの値を変更
    const variantInput1 = screen.getByTestId('consonant-variant-input-1').querySelector('input');
    expect(variantInput1).not.toBeNull();
    fireEvent.change(variantInput1!, { target: { value: 'さ,し,す,せ,そ' } });

    // setConsonantが正しい引数で呼ばれることを確認
    expect(mockSetConsonant).toHaveBeenCalledWith([
      { consonant: "k", variant: "か,き,く", length: 100 },        // 1番目は変更されていない
      { consonant: "s", variant: "さ,し,す,せ,そ", length: 150 }   // 2番目のvariantが変更されている
    ]);
  });

  it("lengthInputの値を変更した場合、setConsonantが正しく呼ばれる", async () => {
    const mockSetConsonant = vi.fn();
    const mockConsonantData = [
      { consonant: "k", variant: "か,き,く", length: 100 },
      { consonant: "s", variant: "さ,し,す", length: 150 }
    ];

    render(
      <MakePanelConsonantAccordion
        consonant={mockConsonantData}
        setConsonant={mockSetConsonant}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const lengthInput0 = screen.getByTestId('consonant-length-input-0').querySelector('input');
      expect(lengthInput0).toBeInTheDocument();
    });

    // 1番目のlengthInputの値を変更
    const lengthInput0 = screen.getByTestId('consonant-length-input-0').querySelector('input');
    expect(lengthInput0).not.toBeNull();
    fireEvent.change(lengthInput0!, { target: { value: '250' } });

    // setConsonantが正しい引数で呼ばれることを確認
    expect(mockSetConsonant).toHaveBeenCalledWith([
      { consonant: "k", variant: "か,き,く", length: "250" }, // 1番目のlengthが変更されている
      { consonant: "s", variant: "さ,し,す", length: 150 }    // 2番目は変更されていない
    ]);
  });

  it("addButtonが押された場合、setConsonantが新しい空の要素と共に呼ばれる", async () => {
    const mockSetConsonant = vi.fn();
    const mockConsonantData = [
      { consonant: "k", variant: "か,き,く", length: 100 },
      { consonant: "s", variant: "さ,し,す", length: 150 }
    ];

    render(
      <MakePanelConsonantAccordion
        consonant={mockConsonantData}
        setConsonant={mockSetConsonant}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const addButton = screen.getByTestId('consonant-add-button');
      expect(addButton).toBeInTheDocument();
    });

    // 追加ボタンをクリック
    const addButton = screen.getByTestId('consonant-add-button');
    fireEvent.click(addButton);

    // setConsonantが正しい引数で呼ばれることを確認
    expect(mockSetConsonant).toHaveBeenCalledWith([
      { consonant: "k", variant: "か,き,く", length: 100 },   // 既存の1番目の要素
      { consonant: "s", variant: "さ,し,す", length: 150 },   // 既存の2番目の要素
      { consonant: "", variant: "", length: 0 }              // 新しく追加された空の要素
    ]);
  });
});
