import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach,Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DarkModeMenu, DarkModeButtonProps } from "../../../../src/components/Header/HeaderMenuItem/DarkModeMenu";
import { useCookieStore } from "../../../../src/store/cookieStore";

// モック
vi.mock("../../../../src/store/cookieStore", () => ({
  useCookieStore: vi.fn(),
}));

describe("DarkModeMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  const defaultProps: DarkModeButtonProps = {
    setMenuAnchor: mockSetMenuAnchor,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("ダークモードの場合、ライトモードへの切り替えが表示される", () => {
    (useCookieStore as unknown as Mock).mockReturnValue({
      mode: "dark",
      setMode: vi.fn(),
    });

    render(<DarkModeMenu {...defaultProps} />);

    // ライトモードへの切り替えが表示されていることを確認
    expect(screen.getByText("menu.toLightMode")).toBeInTheDocument();
    expect(screen.getByTestId("LightModeIcon")).toBeInTheDocument();
  });

  it("ライトモードの場合、ダークモードへの切り替えが表示される", () => {
    (useCookieStore as unknown as Mock).mockReturnValue({
      mode: "light",
      setMode: vi.fn(),
    });

    render(<DarkModeMenu {...defaultProps} />);

    // ダークモードへの切り替えが表示されていることを確認
    expect(screen.getByText("menu.toDarkMode")).toBeInTheDocument();
    expect(screen.getByTestId("ModeNightIcon")).toBeInTheDocument();
  });

  it("ダークモードからライトモードに切り替える", () => {
    const mockSetMode = vi.fn();
    (useCookieStore as unknown as Mock).mockReturnValue({
      mode: "dark",
      setMode: mockSetMode,
    });

    render(<DarkModeMenu {...defaultProps} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.toLightMode");
    fireEvent.click(menuItem);

    // モードがライトモードに変更されることを確認
    expect(mockSetMode).toHaveBeenCalledWith("light");

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("ライトモードからダークモードに切り替える", () => {
    const mockSetMode = vi.fn();
    (useCookieStore as unknown as Mock).mockReturnValue({
      mode: "light",
      setMode: mockSetMode,
    });

    render(<DarkModeMenu {...defaultProps} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.toDarkMode");
    fireEvent.click(menuItem);

    // モードがダークモードに変更されることを確認
    expect(mockSetMode).toHaveBeenCalledWith("dark");

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});