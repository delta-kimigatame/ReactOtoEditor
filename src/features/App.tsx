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

/**
 * Reactのエンドポイント
 * @returns 全体のjsx
 */
export const App: React.FC = () => {
  useInitializeApp();
  const mode_ = useThemeMode();
  const { language } = useCookieStore();
  const { oto } = useOtoProjectStore();
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
      <Header />
      {oto !== null && <EditorView />}
      {oto === null && <TopView />}
      {oto === null && <Footer />}
    </ThemeProvider>
  );
};
