import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { CookiesProvider } from "react-cookie";
import { describe, expect, it } from "vitest";
import { cookieDefaults } from "../../src/config/cookie";
import { useProjectCookie } from "../../src/services/useProjectCookie";
const TestProjectCookieMode: React.FC = () => {
  const { mode, setMode } = useProjectCookie();
  return (
    <div>
      <p>Mode: {mode}</p>
      <button onClick={() => setMode("dark")}>Set Dark Mode</button>
    </div>
  );
};
const TestProjectCookieLanguage: React.FC = () => {
  const { language, setLanguage } = useProjectCookie();
  return (
    <div>
      <p>Language: {language}</p>
      <button onClick={() => setLanguage("en")}>Set en</button>
    </div>
  );
};
const TestProjectCookieColorTheme: React.FC = () => {
  const { colorTheme, setColorTheme } = useProjectCookie();
  return (
    <div>
      <p>ColorTheme: {colorTheme}</p>
      <button onClick={() => setColorTheme("red")}>Set red</button>
    </div>
  );
};
const TestProjectCookieOverlapLock: React.FC = () => {
  const { overlapLock, setOverlapLock } = useProjectCookie();
  return (
    <div>
      <p>OverlapLock: {overlapLock.toString()}</p>
      <button onClick={() => setOverlapLock(true)}>Set OverlapLock</button>
    </div>
  );
};
const TestProjectCookieTouchMode: React.FC = () => {
  const { touchMode, setTouchMode } = useProjectCookie();
  return (
    <div>
      <p>TouchMode: {touchMode.toString()}</p>
      <button onClick={() => setTouchMode(true)}>Set TouchMode</button>
    </div>
  );
};

describe("useProjectCookie", () => {
  it("defaultMode", () => {
    render(
      <CookiesProvider>
        <TestProjectCookieMode />
      </CookiesProvider>
    );
    expect(screen.getByText("Mode: system")).toBeInTheDocument();
  });
  it("hasMode", () => {
    document.cookie = "mode=dark; path=/;";
    render(
      <CookiesProvider>
        <TestProjectCookieMode />
      </CookiesProvider>
    );
    expect(screen.getByText("Mode: dark")).toBeInTheDocument();
  });
  it("changeMode", async () => {
    render(
      <CookiesProvider>
        <TestProjectCookieMode />
      </CookiesProvider>
    );
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(screen.getByText("Mode: dark")).toBeInTheDocument();
  });
  it("defaultLanguage", () => {
    render(
      <CookiesProvider>
        <TestProjectCookieLanguage />
      </CookiesProvider>
    );
    expect(screen.getByText("Language: en")).toBeInTheDocument();
  });
  it("hasLanguage", () => {
    document.cookie = "language=en; path=/;";
    render(
      <CookiesProvider>
        <TestProjectCookieLanguage />
      </CookiesProvider>
    );
    expect(screen.getByText("Language: en")).toBeInTheDocument();
  });
  it("changeLanguage", async () => {
    render(
      <CookiesProvider>
        <TestProjectCookieLanguage />
      </CookiesProvider>
    );
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(screen.getByText("Language: en")).toBeInTheDocument();
  });
  it("defaultColorTheme", () => {
    render(
      <CookiesProvider>
        <TestProjectCookieColorTheme />
      </CookiesProvider>
    );
    expect(screen.getByText("ColorTheme: gray")).toBeInTheDocument();
  });
  it("hasColorTheme", () => {
    document.cookie = "colorTheme=red; path=/;";
    render(
      <CookiesProvider>
        <TestProjectCookieColorTheme />
      </CookiesProvider>
    );
    expect(screen.getByText("ColorTheme: red")).toBeInTheDocument();
  });
  it("changeColorTheme", async () => {
    render(
      <CookiesProvider>
        <TestProjectCookieColorTheme />
      </CookiesProvider>
    );
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(screen.getByText("ColorTheme: red")).toBeInTheDocument();
  });
  it("defaultOverlapLock", () => {
    render(
      <CookiesProvider>
        <TestProjectCookieOverlapLock />
      </CookiesProvider>
    );
    expect(screen.getByText("OverlapLock: false")).toBeInTheDocument();
  });
  it("hasOverlapLock", () => {
    document.cookie = "overlapLock=true; path=/;";
    render(
      <CookiesProvider>
        <TestProjectCookieOverlapLock />
      </CookiesProvider>
    );
    expect(screen.getByText("OverlapLock: true")).toBeInTheDocument();
  });
  it("changeOverlapLock", async () => {
    render(
      <CookiesProvider>
        <TestProjectCookieOverlapLock />
      </CookiesProvider>
    );
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(screen.getByText("OverlapLock: true")).toBeInTheDocument();
  });
  it("defaultTouchMode", () => {
    render(
      <CookiesProvider>
        <TestProjectCookieTouchMode />
      </CookiesProvider>
    );
    expect(screen.getByText("TouchMode: false")).toBeInTheDocument();
  });
  it("hasTouchMode", () => {
    document.cookie = "touchMode=true; path=/;";
    render(
      <CookiesProvider>
        <TestProjectCookieTouchMode />
      </CookiesProvider>
    );
    expect(screen.getByText("TouchMode: true")).toBeInTheDocument();
  });
  it("changeTouchMode", async () => {
    render(
      <CookiesProvider>
        <TestProjectCookieTouchMode />
      </CookiesProvider>
    );
    const button = screen.getByRole("button");
    await fireEvent.click(button);
    expect(screen.getByText("TouchMode: true")).toBeInTheDocument();
  });
});
