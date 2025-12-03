import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DownloadZipMenu } from "../../../../src/features/Header/HeaderMenuItem/DownloadZipMenu";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import { GetStorageOto } from "../../../../src/services/StorageOto";
import { Oto } from "utauoto";
import { JSZipObject } from "jszip";

describe("DownloadZipMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock(
      "../../../../src/components/DownloadZipDialog/DownloadZipDialog",
      () => ({
        DownloadZipDialog: ({ targetList }: { targetList: Array<number> }) => (
          <div data-testid="mock-dialog">{JSON.stringify(targetList)}</div>
        ),
      })
    );

    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.zipFileName = "test.zip";
    store.readZip = {
      "dir1/oto.ini": {} as JSZipObject,
      "dir2/oto.ini": {} as JSZipObject,
      "dir3/oto.ini": {} as JSZipObject,
    };
    store.targetDirs = ["dir1", "dir2", "dir3", "dir4"];
    store.targetDir = "dir1";
    store.oto = new Oto();
    vi.mock("../../../../src/services/StorageOto", () => ({
      GetStorageOto: vi.fn().mockReturnValue({
        "test.zip": {
          dir1: {},
          dir2: {},
        },
      }),
    }));
  });

  it("メニュー項目が正しく表示される", () => {
    render(<DownloadZipMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.zipDownload")).toBeInTheDocument();
    expect(screen.getByTestId("FolderZipIcon")).toBeInTheDocument();
  });

  it("メニューをクリックするとダイアログが開く", () => {
    render(<DownloadZipMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.zipDownload");
    fireEvent.click(menuItem);

    // ダイアログが開かれることを確認
    expect(screen.getByTestId("mock-dialog")).toBeInTheDocument();
  });

  it("storagedOto が正しく設定される", () => {
    render(<DownloadZipMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.zipDownload");
    fireEvent.click(menuItem);

    // GetStorageOto が呼び出されることを確認
    expect(GetStorageOto).toHaveBeenCalled();
  });

  it("targetList が期待された値であることを確認する", async () => {
    render(<DownloadZipMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.zipDownload");
    fireEvent.click(menuItem);

    // モックされた DownloadZipDialog から targetList を取得
    const mockDialog = screen.getByTestId("mock-dialog");
    const targetList = JSON.parse(mockDialog.textContent || "[]");

    // targetList の値を確認
    expect(targetList).toEqual([0, 1, 2, 3]); // dir1: 0 (編集中), dir2: 1 (履歴有), dir3: 2 (元zip内に有), dir4: 3 (新規追加)
  });
});
