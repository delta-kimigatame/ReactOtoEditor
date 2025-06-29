import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ColorMenu } from "../../../../src/features/Header/HeaderMenuItem/ColorMenu";
import { specColor } from "../../../../src/config/colors";
import { useCookieStore } from "../../../../src/store/cookieStore";

describe("ColorMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // ストアの初期化
    const store = useCookieStore.getState();
    store.colorTheme = "red";
    store.setColorTheme = vi.fn();
  });

  it("メニュー項目が正しく表示される", () => {
    render(<ColorMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.changeColor")).toBeInTheDocument();
    expect(screen.getByTestId("ColorAvatar")).toBeInTheDocument();
  });

  it("メニューをクリックすると色選択メニューが開く", () => {
    render(<ColorMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.changeColor");
    fireEvent.click(menuItem);

    // 色選択メニューが開かれることを確認
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // specColor に基づいてすべての色が表示されていることを確認
    Object.keys(specColor).forEach((color) => {
      expect(screen.getByText("color." + color)).toBeInTheDocument();
    });
  });

  it("色を選択すると setColorTheme が呼び出され、メニューが閉じる", () => {
    render(<ColorMenu setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目をクリックしてメニューを開く
    const menuItem = screen.getByText("menu.changeColor");
    fireEvent.click(menuItem);

    // 色を選択
    const colorItem = screen.getByText("color.blue");
    fireEvent.click(colorItem);

    // setColorTheme が呼び出されることを確認
    const store = useCookieStore.getState();
    expect(store.setColorTheme).toHaveBeenCalledWith("blue");

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});