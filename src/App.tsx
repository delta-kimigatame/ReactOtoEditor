import * as React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookies } from "react-cookie";

import Paper from "@mui/material/Paper";

import { getDesignTokens } from "./settings/theme";
import { Header } from "./Header";
import { Footer } from "./Fotter";
import { WavCanvas } from "./WavCanvas";

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
  const [cookies, setCookie, removeCookie] = useCookies(["mode"]);
  const mode_: PaletteMode =
    cookies.mode !== undefined
      ? cookies.mode
      : prefersDarkMode
      ? "dark"
      : "light";
  const [mode, setMode] = React.useState<PaletteMode>(mode_);
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === "light" ? "dark" : "light"
        );
      },
    }),
    []
  );
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  React.useMemo(() => setCookie("mode", mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header mode={mode} setMode={setMode} />
      <WavCanvas mode={mode}/>
      <Footer theme={theme} />
    </ThemeProvider>
  );
};