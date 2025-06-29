import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageMenu, LanguageButtonProps } from "../../../../src/features/Header/HeaderMenuItem/LanguageMenu";
import { useCookieStore } from "../../../../src/store/cookieStore";

// モック
vi.mock("../../../../src/store/cookieStore", () => ({
  useCookieStore: vi.fn(),
}));

describe("LanguageMenu", () => {
  const mockSetMenuAnchor = vi.fn();

  const defaultProps: LanguageButtonProps = {
    setMenuAnchor: mockSetMenuAnchor,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useCookieStore as vi.Mock).mockReturnValue({
      language: "en",
      setLanguage: vi.fn(),
    });
  });

  it("現在の言語が表示される", () => {
    render(<LanguageMenu {...defaultProps} />);

    // 現在の言語 (en) が表示されていることを確認
    expect(screen.getByText("en")).toBeInTheDocument();
  });

  it("メニュー項目をクリックするとメニューが開く", () => {
    render(<LanguageMenu {...defaultProps} />);

    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.changeLanguage");
    fireEvent.click(menuItem);

    // メニューが開いていることを確認
    expect(screen.getByText("language.ja")).toBeInTheDocument();
    expect(screen.getByText("language.en")).toBeInTheDocument();
    expect(screen.getByText("language.zh")).toBeInTheDocument();
  });

  it("日本語を選択すると言語が変更され、メニューが閉じる", () => {
    const mockSetLanguage = vi.fn();
    (useCookieStore as vi.Mock).mockReturnValue({
      language: "en",
      setLanguage: mockSetLanguage,
    });

    render(<LanguageMenu {...defaultProps} />);

    // メニュー項目をクリックしてメニューを開く
    const menuItem = screen.getByText("menu.changeLanguage");
    fireEvent.click(menuItem);

    // 日本語を選択
    const jaMenuItem = screen.getByText("language.ja");
    fireEvent.click(jaMenuItem);

    // 言語が日本語に変更されることを確認
    expect(mockSetLanguage).toHaveBeenCalledWith("ja");

    // メニューが閉じることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("英語を選択すると言語が変更され、メニューが閉じる", () => {
    const mockSetLanguage = vi.fn();
    (useCookieStore as vi.Mock).mockReturnValue({
      language: "ja",
      setLanguage: mockSetLanguage,
    });

    render(<LanguageMenu {...defaultProps} />);

    // メニュー項目をクリックしてメニューを開く
    const menuItem = screen.getByText("menu.changeLanguage");
    fireEvent.click(menuItem);

    // 英語を選択
    const enMenuItem = screen.getByText("language.en");
    fireEvent.click(enMenuItem);

    // 言語が英語に変更されることを確認
    expect(mockSetLanguage).toHaveBeenCalledWith("en");

    // メニューが閉じることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("中国語を選択すると言語が変更され、メニューが閉じる", () => {
    const mockSetLanguage = vi.fn();
    (useCookieStore as vi.Mock).mockReturnValue({
      language: "en",
      setLanguage: mockSetLanguage,
    });

    render(<LanguageMenu {...defaultProps} />);

    // メニュー項目をクリックしてメニューを開く
    const menuItem = screen.getByText("menu.changeLanguage");
    fireEvent.click(menuItem);

    // 中国語を選択
    const zhMenuItem = screen.getByText("language.zh");
    fireEvent.click(zhMenuItem);

    // 言語が中国語に変更されることを確認
    expect(mockSetLanguage).toHaveBeenCalledWith("zh");

    // メニューが閉じることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});