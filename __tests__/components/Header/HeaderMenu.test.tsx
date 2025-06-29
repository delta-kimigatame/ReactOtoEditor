import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderMenu } from "../../../src/components/Header/HeaderMenu";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import { Oto } from "utauoto";

describe("HeaderMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  const defaultProps = {
    menuAnchor: document.createElement("div"),
    setMenuAnchor: mockSetMenuAnchor,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.oto = null;
    store.setOto = vi.fn();
  });

  it("メニューが表示される", () => {
    render(<HeaderMenu {...defaultProps} />);

    // メニューが表示されていることを確認
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("oto が null の場合、特定のメニュー項目が表示されない", () => {
    const store = useOtoProjectStore.getState();
    store.oto = null;

    render(<HeaderMenu {...defaultProps} />);

    // oto が null の場合、DownloadOtoMenu と DownloadZipMenu が表示されないことを確認
    expect(screen.queryByText("menu.otoDownload")).not.toBeInTheDocument();
    expect(screen.queryByText("menu.zipDownload")).not.toBeInTheDocument();
  });

  it("oto が存在する場合、特定のメニュー項目が表示される", () => {
    const store = useOtoProjectStore.getState();
    store.oto = new Oto();

    render(<HeaderMenu {...defaultProps} />);

    // oto が存在する場合、DownloadOtoMenu と DownloadZipMenu が表示されることを確認
    expect(screen.getByText("menu.otoDownload")).toBeInTheDocument();
    expect(screen.getByText("menu.zipDownload")).toBeInTheDocument();
  });

  it("メニューを閉じると setMenuAnchor が呼び出される", () => {
    render(<HeaderMenu {...defaultProps} />);

    // メニューを閉じる
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape", code: "Escape" });

    // setMenuAnchor が null で呼び出されることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});
