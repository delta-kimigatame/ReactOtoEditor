import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { Oto } from "utauoto";

import { TargetDirDialogButtonArea } from "../../../src/features/TargetDirDialog/TargetDirDialogButtonArea";

// useOtoProjectStore のモック（setOtoのみモック化）
const mockSetOto = vi.fn();
vi.mock("../../../src/store/otoProjectStore", () => ({
  useOtoProjectStore: () => ({
    setOto: mockSetOto,
  }),
}));

describe("TargetDirDialogButtonArea", () => {
  const mockSetDialogOpen = vi.fn();
  const mockSetOtoTemp = vi.fn();
  const mockLoadOto = vi.fn();
  const mockSetEncoding = vi.fn();
  const mockOto = new Oto();

  const defaultProps = {
    setDialogOpen: mockSetDialogOpen,
    oto: mockOto,
    setOtoTemp: mockSetOtoTemp,
    LoadOto: mockLoadOto,
    encoding: "UTF8",
    setEncoding: mockSetEncoding,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSetOto.mockReset();
  });

  describe("OnSelectChange", () => {
    it("SJISからUTF8が選択された時、setEncodingとsetOtoTempとLoadOtoが正しく呼ばれる", () => {
      // 初期状態をSJISにして変更を検出できるようにする
      const propsWithSJIS = { ...defaultProps, encoding: "SJIS" };
      render(<TargetDirDialogButtonArea {...propsWithSJIS} />);

      const hiddenInput = screen.getByDisplayValue("SJIS");
      fireEvent.change(hiddenInput, { target: { value: "UTF8" } });

      // 関数が正しく呼ばれることを確認
      expect(mockSetEncoding).toHaveBeenCalledWith("UTF8");
      expect(mockSetOtoTemp).toHaveBeenCalledWith(null);
      expect(mockLoadOto).toHaveBeenCalledWith("UTF8");
    });

    it("UTF8からSJISが選択された時、setEncodingとsetOtoTempとLoadOtoが正しく呼ばれる", () => {
      render(<TargetDirDialogButtonArea {...defaultProps} />);

      const hiddenInput = screen.getByDisplayValue("UTF8");
      fireEvent.change(hiddenInput, { target: { value: "SJIS" } });

      // 関数が正しく呼ばれることを確認
      expect(mockSetEncoding).toHaveBeenCalledWith("SJIS");
      expect(mockSetOtoTemp).toHaveBeenCalledWith(null);
      expect(mockLoadOto).toHaveBeenCalledWith("SJIS");
    });
  });

  describe("OnSubmitClick", () => {
    it("submitボタンクリック時にsetOtoが正しいOtoで呼ばれ、setDialogOpenがfalseで呼ばれる", () => {
      render(<TargetDirDialogButtonArea {...defaultProps} />);

      const submitButton = screen.getByTestId("submit-button");
      fireEvent.click(submitButton);

      // setOtoが正しいOtoインスタンスで呼ばれることを確認
      expect(mockSetOto).toHaveBeenCalledWith(mockOto);
      expect(mockSetOto).toHaveBeenCalledTimes(1);

      // setDialogOpenがfalseで呼ばれることを確認
      expect(mockSetDialogOpen).toHaveBeenCalledWith(false);
      expect(mockSetDialogOpen).toHaveBeenCalledTimes(1);
    });
  });
});
