import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DownloadOtoMenu } from "../../../../src/features/Header/HeaderMenuItem/DownloadOtoMenu";
import { LOG } from "../../../../src/lib/Logging";
import { useOtoProjectStore } from "../../../../src/store/otoProjectStore";
import { Oto } from "utauoto";

describe("DownloadOtoMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    LOG.clear(); // LOGをクリア

    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.targetDir = "dir1";
    store.oto = new Oto();
  });

  it("メニュー項目が正しく表示される", () => {
    render(<DownloadOtoMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.otoDownload")).toBeInTheDocument();
    expect(screen.getByTestId("DownloadIcon")).toBeInTheDocument();
  });

  it("クリックするとoto.iniがダウンロードされ、親メニューが閉じられる", () => {
    render(<DownloadOtoMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.otoDownload");
    fireEvent.click(menuItem);

    // LOG.datas を使用してクリックイベントを確認
    const logEntries = LOG.datas.filter((entry) =>
      entry.includes("oto.iniのダウンロード")
    );
    expect(logEntries.length).toBe(1);

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});
