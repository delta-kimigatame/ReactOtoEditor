import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { CookiesProvider, useCookies } from "react-cookie";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { COOKIE_KEYS, cookieDefaults } from "../../src/config/cookie";
import {
  useCookieStore,
  useInitializeCookieStore,
} from "../../src/store/cookieStore";

// テスト用コンポーネント
const TestComponent = () => {
  useInitializeCookieStore(); // Zustand の初期化

  const {
    mode,
    language,
    colorTheme,
    overlapLock,
    touchMode,
    setMode,
    setLanguage,
    setColorTheme,
    setOverlapLock,
    setTouchMode,
  } = useCookieStore();
  const [cookies] = useCookies();

  return (
    <div>
      <p data-testid="mode">{mode}</p>
      <p data-testid="language">{language}</p>
      <p data-testid="colorTheme">{colorTheme}</p>
      <p data-testid="touchMode">{touchMode.toString()}</p>
      <p data-testid="overlapLock">{overlapLock.toString()}</p>
      <button onClick={() => setMode("dark")}>Set Mode Dark</button>
      <button onClick={() => setLanguage("en")}>Set Language EN</button>
      <button onClick={() => setColorTheme("red")}>Set Color Theme Red</button>
      <button onClick={() => setOverlapLock(true)}>Set OverlapLock true</button>
      <button onClick={() => setTouchMode(false)}>Set TouchMode false</button>
    </div>
  );
};

describe("cookieStore", () => {
  beforeEach(() => {
    // Cookie をクリアして初期状態を確認しやすくする
    document.cookie = "";
    useCookieStore.setState({
      mode: cookieDefaults.mode,
      language: cookieDefaults.language,
      colorTheme: cookieDefaults.colorTheme,
      overlapLock: cookieDefaults.overlapLock,
      touchMode: cookieDefaults.touchMode,
      setModeInCookie: () => {},
      setLanguageInCookie: () => {},
      setColorThemeInCookie: () => {},
      setOverlapLockInCookie: () => {},
      setTouchModeInCookie: () => {},
      isInitialized: false,
    });
  });

  afterEach(() => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      document.cookie =
        name + "=;expires=" + new Date(0).toUTCString() + ";path=/";
    });
  });

  it("zustandDefault", () => {
    render(
      <CookiesProvider>
        <TestComponent />
      </CookiesProvider>
    );

    expect(screen.getByTestId("mode")).toHaveTextContent(cookieDefaults.mode);
    expect(screen.getByTestId("language")).toHaveTextContent(
      cookieDefaults.language
    );
    expect(screen.getByTestId("colorTheme")).toHaveTextContent(
      cookieDefaults.colorTheme
    );
    expect(screen.getByTestId("overlapLock")).toHaveTextContent(
      cookieDefaults.overlapLock.toString()
    );
    expect(screen.getByTestId("touchMode")).toHaveTextContent(
      cookieDefaults.touchMode.toString()
    );
  });

  it("zustandLoadCookie", async () => {
    // クッキーに事前に値をセット
    document.cookie = `${COOKIE_KEYS.mode}=dark`;
    document.cookie = `${COOKIE_KEYS.language}=en`;
    document.cookie = `${COOKIE_KEYS.colorTheme}=red`;
    document.cookie = `${COOKIE_KEYS.overlapLock}=true`;
    document.cookie = `${COOKIE_KEYS.touchMode}=false`;

    render(
      <CookiesProvider>
        <TestComponent />
      </CookiesProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("mode")).toHaveTextContent("dark");
      expect(screen.getByTestId("language")).toHaveTextContent("en");
      expect(screen.getByTestId("colorTheme")).toHaveTextContent("red");
      expect(screen.getByTestId("overlapLock")).toHaveTextContent("true");
      expect(screen.getByTestId("touchMode")).toHaveTextContent("false");
    });
  });

  it("zustandChangeValue", () => {
    render(
      <CookiesProvider>
        <TestComponent />
      </CookiesProvider>
    );

    fireEvent.click(screen.getByText("Set Mode Dark"));
    fireEvent.click(screen.getByText("Set Language EN"));
    fireEvent.click(screen.getByText("Set Color Theme Red"));
    fireEvent.click(screen.getByText("Set OverlapLock true"));
    fireEvent.click(screen.getByText("Set TouchMode false"));

    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    expect(screen.getByTestId("language")).toHaveTextContent("en");
    expect(screen.getByTestId("colorTheme")).toHaveTextContent("red");
    expect(screen.getByTestId("overlapLock")).toHaveTextContent("true");
    expect(screen.getByTestId("touchMode")).toHaveTextContent("false");
  });

  it("changeCookieWhenChangeValue", async () => {
    render(
      <CookiesProvider>
        <TestComponent />
      </CookiesProvider>
    );

    fireEvent.click(screen.getByText("Set Mode Dark"));
    fireEvent.click(screen.getByText("Set Language EN"));
    fireEvent.click(screen.getByText("Set Color Theme Red"));
    fireEvent.click(screen.getByText("Set OverlapLock true"));
    fireEvent.click(screen.getByText("Set TouchMode false"));

    await waitFor(() => {
      expect(document.cookie).toContain(`${COOKIE_KEYS.mode}=dark`);
      expect(document.cookie).toContain(`${COOKIE_KEYS.language}=en`);
      expect(document.cookie).toContain(`${COOKIE_KEYS.colorTheme}=red`);
      expect(document.cookie).toContain(`${COOKIE_KEYS.overlapLock}=true`);
      expect(document.cookie).toContain(`${COOKIE_KEYS.touchMode}=false`);
    });
  });
});
