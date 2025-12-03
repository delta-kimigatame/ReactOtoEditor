import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MakePanelReplaceAccordion } from "../../../../src/features/TargetDirDialog/MakePanel/MakePanelReplaceAccordion";

describe("MakePanelReplaceAccordion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("replaceプロパティのデータが正しく描画される", async () => {
    const mockSetReplace = vi.fn();
    const mockReplaceData: Array<[string, string]> = [
      ["お", "を"],
      ["じ", "ぢ"],
      ["ず", "づ"]
    ];

    render(
      <MakePanelReplaceAccordion
        replace={mockReplaceData}
        setReplace={mockSetReplace}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      // 1番目の置換データ(お → を)が正しく表示されることを確認
      const beforeInput0 = screen.getByTestId('replace-before-input-0').querySelector('input');
      const afterInput0 = screen.getByTestId('replace-after-input-0').querySelector('input');
      expect(beforeInput0).toHaveDisplayValue('お');
      expect(afterInput0).toHaveDisplayValue('を');
    });

    // 2番目と3番目の置換データも確認
    const beforeInput1 = screen.getByTestId('replace-before-input-1').querySelector('input');
    const afterInput1 = screen.getByTestId('replace-after-input-1').querySelector('input');
    expect(beforeInput1).toHaveDisplayValue('じ');
    expect(afterInput1).toHaveDisplayValue('ぢ');

    const beforeInput2 = screen.getByTestId('replace-before-input-2').querySelector('input');
    const afterInput2 = screen.getByTestId('replace-after-input-2').querySelector('input');
    expect(beforeInput2).toHaveDisplayValue('ず');
    expect(afterInput2).toHaveDisplayValue('づ');

    // 追加ボタンが表示されることを確認
    const addButton = screen.getByTestId('replace-add-button');
    expect(addButton).toBeInTheDocument();
  });

  it("beforeInputの値を変更した場合、setReplaceが正しく呼ばれる", async () => {
    const mockSetReplace = vi.fn();
    const mockReplaceData: Array<[string, string]> = [
      ["お", "を"],
      ["じ", "ぢ"]
    ];

    render(
      <MakePanelReplaceAccordion
        replace={mockReplaceData}
        setReplace={mockSetReplace}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const beforeInput0 = screen.getByTestId('replace-before-input-0').querySelector('input');
      expect(beforeInput0).toBeInTheDocument();
    });

    // 1番目のbeforeInputの値を変更
    const beforeInput0 = screen.getByTestId('replace-before-input-0').querySelector('input');
    expect(beforeInput0).not.toBeNull();
    fireEvent.change(beforeInput0!, { target: { value: 'は' } });

    // setReplaceが正しい引数で呼ばれることを確認
    expect(mockSetReplace).toHaveBeenCalledWith([
      ["は", "を"], // 1番目のbefore値が変更されている
      ["じ", "ぢ"]  // 2番目は変更されていない
    ]);
  });

  it("afterInputの値を変更した場合、setReplaceが正しく呼ばれる", async () => {
    const mockSetReplace = vi.fn();
    const mockReplaceData: Array<[string, string]> = [
      ["お", "を"],
      ["じ", "ぢ"]
    ];

    render(
      <MakePanelReplaceAccordion
        replace={mockReplaceData}
        setReplace={mockSetReplace}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const afterInput0 = screen.getByTestId('replace-after-input-0').querySelector('input');
      expect(afterInput0).toBeInTheDocument();
    });

    // 2番目のafterInputの値を変更
    const afterInput1 = screen.getByTestId('replace-after-input-1').querySelector('input');
    expect(afterInput1).not.toBeNull();
    fireEvent.change(afterInput1!, { target: { value: 'い' } });

    // setReplaceが正しい引数で呼ばれることを確認
    expect(mockSetReplace).toHaveBeenCalledWith([
      ["お", "を"], // 1番目は変更されていない
      ["じ", "い"]  // 2番目のafter値が変更されている
    ]);
  });

  it("addButtonが押された場合、setReplaceが新しい空の要素と共に呼ばれる", async () => {
    const mockSetReplace = vi.fn();
    const mockReplaceData: Array<[string, string]> = [
      ["お", "を"],
      ["じ", "ぢ"]
    ];

    render(
      <MakePanelReplaceAccordion
        replace={mockReplaceData}
        setReplace={mockSetReplace}
      />
    );

    // Accordionを開く
    const accordionHeader = screen.getByRole('button', { expanded: false });
    fireEvent.click(accordionHeader);

    // Accordionが開かれるのを待つ
    await waitFor(() => {
      const addButton = screen.getByTestId('replace-add-button');
      expect(addButton).toBeInTheDocument();
    });

    // 追加ボタンをクリック
    const addButton = screen.getByTestId('replace-add-button');
    fireEvent.click(addButton);

    // setReplaceが正しい引数で呼ばれることを確認
    expect(mockSetReplace).toHaveBeenCalledWith([
      ["お", "を"],   // 既存の1番目の要素
      ["じ", "ぢ"],   // 既存の2番目の要素
      ["", ""]       // 新しく追加された空の要素
    ]);
  });
});
