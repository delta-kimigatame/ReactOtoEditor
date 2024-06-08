import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookies } from "react-cookie";

import Paper from "@mui/material/Paper";

import { getDesignTokens } from "./settings/theme";
import { Header } from "./Header/Header";
import { Footer } from "./Fotter";
import { WavCanvas } from "./WavCanvas";
import i18n from "./i18n/configs";
import { TopView } from "./Top/TopView";

/**
 * Reactのエンドポイント
 * @returns 全体のjsx
 */
export const App: React.FC = () => {
  // 端末のダークモード設定取得
  const prefersDarkMode: boolean = useMediaQuery(
    "(prefers-color-scheme: dark)"
  );
  // cookieの取得
  const [cookies, setCookie, removeCookie] = useCookies([
    "mode",
    "color",
    "language",
  ]);
  const mode_: PaletteMode =
    cookies.mode !== undefined
      ? cookies.mode
      : prefersDarkMode
      ? "dark"
      : "light";
  const color_: string = cookies.color !== undefined ? cookies.color : "gray";
  const language_: string =
    cookies.language !== undefined ? cookies.language : "ja";
  const [mode, setMode] = React.useState<PaletteMode>(mode_);
  const [color, setColor] = React.useState<string>(color_);
  const [language, setLanguage] = React.useState<string>(language_);
  const [readZip, setReadZip] = React.useState<ArrayBuffer | null>(null);
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  React.useMemo(() => setCookie("mode", mode), [mode]);
  React.useMemo(() => setCookie("color", color), [color]);
  React.useMemo(() => {
    setCookie("language", language);
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        mode={mode}
        setMode={setMode}
        color={color}
        setColor={setColor}
        language={language}
        setLanguage={setLanguage}
      />
      <TopView readZip={readZip} setReadZip={setReadZip} />
      <WavCanvas mode={mode} color={color} />
      <Footer theme={theme} />
    </ThemeProvider>
  );
};
