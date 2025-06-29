import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach,vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TargetDirMenu, TargetDirMenuProps } from "../../../../src/features/Header/HeaderMenuItem/TargetDirMenu";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import { GetStorageOto, SaveStorageOto } from "../../../../src/services/StorageOto";
import { Oto } from "utauoto";

// テスト用のストアデータ
const storeData = {
  zipFileName: "test.zip",
  targetDirs: ["dir1", "dir2"],
  targetDir: "dir1",
  oto: new Oto(),
};

describe("TargetDirMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  const defaultProps: TargetDirMenuProps = {
    setMenuAnchor: mockSetMenuAnchor,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.zipFileName = storeData.zipFileName;
    store.targetDirs = storeData.targetDirs;
    store.targetDir = storeData.targetDir;
    store.oto = storeData.oto;
    vi.mock("../../../../src/services/StorageOto", () => ({
      GetStorageOto: vi.fn().mockReturnValue({}),
      SaveStorageOto: vi.fn(),
    }));
  });

  it("複数のターゲットディレクトリがある場合、メニュー項目が表示される", () => {
    render(<TargetDirMenu {...defaultProps} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.changeTargetDir")).toBeInTheDocument();
  });

  it("ターゲットディレクトリがnullの場合、メニュー項目が表示されない", () => {
    const store = useOtoProjectStore.getState();
    store.targetDirs = null; // ターゲットディレクトリを1つに設定

    render(<TargetDirMenu {...defaultProps} />);

    // メニュー項目が表示されていないことを確認
    expect(screen.queryByText("menu.changeTargetDir")).not.toBeInTheDocument();
  });

  it("ターゲットディレクトリが1つしかない場合、メニュー項目が表示されない", () => {
    const store = useOtoProjectStore.getState();
    store.targetDirs = ["dir1"]; // ターゲットディレクトリを1つに設定

    render(<TargetDirMenu {...defaultProps} />);

    // メニュー項目が表示されていないことを確認
    expect(screen.queryByText("menu.changeTargetDir")).not.toBeInTheDocument();
  });

  it("メニュー項目をクリックすると SaveStorageOto が呼び出され、ダイアログが開かれる", () => {
    render(<TargetDirMenu {...defaultProps} />);

    const menuItem = screen.getByText("menu.changeTargetDir");
    fireEvent.click(menuItem);

    // SaveStorageOto が呼び出されることを確認
    expect(GetStorageOto).toHaveBeenCalled();
    expect(SaveStorageOto).toHaveBeenCalledWith({}, storeData.oto, "test.zip", "dir1");

    // ダイアログが開かれることを確認
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ダイアログを閉じると親メニューが閉じられる", () => {
    render(<TargetDirMenu {...defaultProps} />);

    const menuItem = screen.getByText("menu.changeTargetDir");
    fireEvent.click(menuItem);

    // ダイアログを閉じる
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});