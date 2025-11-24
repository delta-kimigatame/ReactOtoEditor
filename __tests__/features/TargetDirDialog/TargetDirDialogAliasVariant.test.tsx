import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { TargetDirDialogAliasVariant } from "../../../src/features/TargetDirDialog/TargetDirDialogAliasVariant";
import { Oto } from "utauoto";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";

describe("TargetDirDialogAliasVariant", () => {
  const mockSetAliasVariant = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // ストアをリセット
    useOtoProjectStore.getState().setOto(null);
  });

  it("UI描画確認：aliasVariantがnullの場合", () => {
    const oto = new Oto();
    oto.ParseOto("A3", "CV.wav=あ,1,2,-3,4,5");
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(
      <TargetDirDialogAliasVariant
        aliasVariant={null}
        setAliasVariant={mockSetAliasVariant}
      />
    );

    // アコーディオンが表示されることを確認
    expect(screen.getByText(/correctType/)).toBeInTheDocument();
  });

  it("UI描画確認：aliasVariantが配列の場合", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* い,6,7,-8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15"
    );
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(
      <TargetDirDialogAliasVariant
        aliasVariant={["CV", "CV", "VCV"]}
        setAliasVariant={mockSetAliasVariant}
      />
    );

    // アコーディオンが表示されることを確認
    expect(screen.getByText(/correctType/)).toBeInTheDocument();
  });

  it("aliasVariant変更確認：1番目の要素をVCVに変更", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* い,6,7,-8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15"
    );
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(
      <TargetDirDialogAliasVariant
        aliasVariant={["CV", "CV", "VCV"]}
        setAliasVariant={mockSetAliasVariant}
      />
    );

    // アコーディオンを展開
    const accordionSummary = screen.getByText(/correctType/);
    fireEvent.click(accordionSummary);

    // 1番目のセレクトボックスを取得して変更
    const hiddenInputs = screen.getAllByDisplayValue("CV");
    fireEvent.change(hiddenInputs[0], { target: { value: "VCV" } });

    // setAliasVariantが正しい配列で呼ばれることを確認
    expect(mockSetAliasVariant).toHaveBeenCalledWith(["VCV", "CV", "VCV"]);
  });

  it("aliasVariant変更確認：2番目の要素をVCに変更", () => {
    const oto = new Oto();
    oto.ParseOto(
      "A3",
      "CV.wav=あ,1,2,-3,4,5\r\nCV.wav=* い,6,7,-8,9,10\r\n_VCV.wav=a う,11,12,-13,14,15"
    );
    useOtoProjectStore.getState().setOto(oto);
    useOtoProjectStore.getState().setTargetDir("A3");

    render(
      <TargetDirDialogAliasVariant
        aliasVariant={["CV", "CV", "VCV"]}
        setAliasVariant={mockSetAliasVariant}
      />
    );

    // アコーディオンを展開
    const accordionSummary = screen.getByText(/correctType/);
    fireEvent.click(accordionSummary);

    // 2番目のセレクトボックスを取得して変更
    const hiddenInputs = screen.getAllByDisplayValue("CV");
    fireEvent.change(hiddenInputs[1], { target: { value: "VC" } });

    // setAliasVariantが正しい配列で呼ばれることを確認
    expect(mockSetAliasVariant).toHaveBeenCalledWith(["CV", "VC", "VCV"]);
  });
});
