import "@testing-library/jest-dom/vitest";
import React from "react";
import { describe, it, expect, vi, beforeEach,Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HeaderMenuClearCache } from "../../../../src/features/Header/HeaderMenuItem/HeaderMenuClearCache";

describe("HeaderMenuClearCache", () => {
  const mockSetMenuAnchor = vi.fn();
  const mockUnregister = vi.fn().mockResolvedValue(true);

  beforeEach(() => {
    vi.clearAllMocks();

    // navigator.serviceWorker をモック
    Object.defineProperty(global.navigator, "serviceWorker", {
      value: {
        getRegistration: vi.fn().mockResolvedValue({
          unregister: mockUnregister,
        }),
      },
      configurable: true,
    });

    // caches をモック
    Object.defineProperty(global, "caches", {
      value: {
        keys: vi.fn().mockResolvedValue(["cache1", "cache2"]),
        delete: vi.fn().mockResolvedValue(true),
      },
      configurable: true,
    });
  });

  it("メニュー項目が正しく表示される", () => {
    render(<HeaderMenuClearCache setMenuAnchor={mockSetMenuAnchor} />);

    // メニュー項目が表示されていることを確認
    expect(screen.getByText("menu.clearAppCache")).toBeInTheDocument();
    expect(screen.getByTestId("CachedIcon")).toBeInTheDocument();
  });

  it("クリックするとキャッシュがクリアされ、親メニューが閉じられる", async () => {
    render(<HeaderMenuClearCache setMenuAnchor={mockSetMenuAnchor} />);
    vi.useFakeTimers()
    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.clearAppCache");
    fireEvent.click(menuItem);

    // 非同期処理の完了を待つ
    await vi.advanceTimersByTimeAsync(0);
    // navigator.serviceWorker.getRegistration が呼び出されることを確認
    expect(navigator.serviceWorker.getRegistration).toHaveBeenCalled();

    // registration.unregister が呼び出されることを確認
    expect(mockUnregister).toHaveBeenCalled();

    // caches.keys が呼び出されることを確認
    expect(caches.keys).toHaveBeenCalled();

    // caches.delete がキャッシュごとに呼び出されることを確認
    expect(caches.delete).toHaveBeenCalledWith("cache1");
    expect(caches.delete).toHaveBeenCalledWith("cache2");

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });

  it("Service Worker が登録されていない場合の処理を確認", async () => {
    // Service Worker が登録されていない場合をモック
    (navigator.serviceWorker.getRegistration as unknown as Mock).mockResolvedValue(
      null
    );

    render(<HeaderMenuClearCache setMenuAnchor={mockSetMenuAnchor} />);

    vi.useFakeTimers()
    // メニュー項目をクリック
    const menuItem = screen.getByText("menu.clearAppCache");
    fireEvent.click(menuItem);

    // 非同期処理の完了を待つ
    await vi.advanceTimersByTimeAsync(0);
    // registration.unregister が呼び出されていないことを確認
    expect(mockUnregister).not.toHaveBeenCalled();
    // caches.keys が呼び出されることを確認
    expect(caches.keys).toHaveBeenCalled();

    // caches.delete がキャッシュごとに呼び出されることを確認
    expect(caches.delete).toHaveBeenCalledWith("cache1");
    expect(caches.delete).toHaveBeenCalledWith("cache2");

    // 親メニューが閉じられることを確認
    expect(mockSetMenuAnchor).toHaveBeenCalledWith(null);
  });
});
