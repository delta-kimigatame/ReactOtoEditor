import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "../../../src/features/Header/Header";
import { useOtoProjectStore } from "../../../src/store/otoProjectStore";
import OtoRecord from "utauoto/dist/OtoRecord";

describe("Header", () => {
  beforeEach(() => {
    // ストアの初期化
    const store = useOtoProjectStore.getState();
    store.record = null;
  });

  it("ロゴとアプリ名が表示される (record が null の場合)", () => {
    render(<Header />);

    // ロゴが表示されていることを確認
    expect(screen.getByAltText("logo")).toBeInTheDocument();

    // アプリ名が表示されていることを確認
    expect(screen.getByText("LABERU")).toBeInTheDocument();
  });

  it("record が存在する場合、エイリアスとファイル名が表示される", () => {
    const store = useOtoProjectStore.getState();
    store.record = {
      alias: "テストエイリアス",
      filename: "test.wav",
    } as OtoRecord;

    render(<Header />);

    // エイリアスとファイル名が表示されていることを確認
    expect(screen.getByText("(テストエイリアス)test")).toBeInTheDocument();
  });

  it("メニューアイコンをクリックするとメニューが開く", () => {
    render(<Header />);

    // メニューアイコンをクリック
    const menuIcon = screen.getByTestId("MenuIcon");
    fireEvent.click(menuIcon);

    // メニューが表示されていることを確認
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("メニューを閉じるとメニューが非表示になる", () => {
    render(<Header />);

    // メニューアイコンをクリックしてメニューを開く
    const menuIcon = screen.getByTestId("MenuIcon");
    fireEvent.click(menuIcon);

    // メニューを閉じる
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Escape", code: "Escape" });

    // メニューが非表示になっていることを確認
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
