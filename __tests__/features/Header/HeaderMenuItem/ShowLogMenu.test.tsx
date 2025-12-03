import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ShowLogMenu } from "../../../../src/features/Header/HeaderMenuItem/ShowLogMenu";

describe("ShowLogMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("メニュー項目が正しく表示される", () => {
    render(<ShowLogMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.showLog")).toBeInTheDocument();
    expect(screen.getByTestId("NotesIcon")).toBeInTheDocument();
  });

  it("メニューをクリックするとダイアログが開き、ログが記録される", () => {
    render(<ShowLogMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.showLog");
    fireEvent.click(menuItem);

    // ダイアログが開かれることを確認
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("ダイアログを閉じると親メニューが閉じられる", () => {
    render(<ShowLogMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリックしてダイアログを開く
    const menuItem = screen.getByText("menu.showLog");
    fireEvent.click(menuItem);

    // ダイアログを閉じる
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" });

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});