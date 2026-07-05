import * as React from "react";
import i18n from "../i18n/configs";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookieStore } from "../store/cookieStore";
import { getDesignTokens } from "../config/theme";

import { Header } from "./Header/Header";
import { Footer } from "../components/Fotter";
import { TopView } from "../components/Top/TopView";
import { EditorView } from "./Editor/EditorView";

import { useInitializeApp } from "../hooks/useInitializeApp";
import { useThemeMode } from "../hooks/useThemeMode";
import { useOtoProjectStore } from "../store/otoProjectStore";
import { PerformanceTestPage } from "../dev-pages/PerformanceTestPage";

/**
 * Reactのエンドポイント
 * @returns 全体のjsx
 */
export const App: React.FC = () => {
  useInitializeApp();
  const mode_ = useThemeMode();
  const { language } = useCookieStore();
  const { oto } = useOtoProjectStore();
    const isDev = window.location.hash.includes("devmode");
  const theme = React.useMemo(
    () => createTheme(getDesignTokens(mode_)),
    [mode_]
  );
  React.useMemo(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isDev && <Header />}
      {isDev && <PerformanceTestPage />}
      {!isDev && oto !== null && <EditorView />}
      {!isDev && oto === null && <TopView />}
      {!isDev && oto === null && <Footer />}
    </ThemeProvider>
  );
};
