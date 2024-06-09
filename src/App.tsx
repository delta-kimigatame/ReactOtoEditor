import * as React from "react";
import JSZip from "jszip";
import i18n from "./i18n/configs";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookies } from "react-cookie";

import Paper from "@mui/material/Paper";

import { getDesignTokens } from "./settings/theme";
import { Header } from "./Header/Header";
import { Footer } from "./Fotter";
import { WavCanvas } from "./Editor/WavCanvas";
import { TopView } from "./Top/TopView";
import { layout } from "./settings/setting";
import { EditorView } from "./Editor/EditorView";

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
  const [readZip, setReadZip] = React.useState<{
    [key: string]: JSZip.JSZipObject;
  } | null>(null);
  const [targetDirs, setTargetDirs] = React.useState<Array<string> | null>(
    null
  );
  const [targetDir, setTargetDir] = React.useState<string | null>(null);
  const [oto, setOto] = React.useState<Oto | null>(null);
  const [record, setRecord] = React.useState<OtoRecord | null>(null);
  const [wavFileName, setWavFileName] = React.useState<string | null>(null);
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  React.useMemo(() => setCookie("mode", mode), [mode]);
  React.useMemo(() => setCookie("color", color), [color]);
  React.useMemo(() => {
    setCookie("language", language);
    i18n.changeLanguage(language);
  }, [language]);

  const [windowSize, setWindowSize] = React.useState<[number, number]>([0, 0]);
  React.useLayoutEffect(() => {
    const updateSize = (): void => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  React.useEffect(() => {
    if (oto === null) {
      setRecord(null);
      setWavFileName(null);
    } else {
      const filename: string = oto.GetFileNames(targetDir)[0];
      const alias: string = oto.GetAliases(targetDir, filename)[0];
      const r: OtoRecord = oto.GetRecord(targetDir, filename, alias);
      setWavFileName(filename);
      setRecord(r);
    }
  }, [oto]);

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
        record={record}
        windowSize={windowSize}
      />
      {oto !== null && (
        <EditorView
          windowSize={windowSize}
          mode={mode}
          color={color}
          oto={oto}
          record={record}
          targetDir={targetDir}
        />
      )}
      {oto === null && (
        <TopView
          readZip={readZip}
          setReadZip={setReadZip}
          targetDirs={targetDirs}
          targetDir={targetDir}
          setTargetDirs={setTargetDirs}
          setTargetDir={setTargetDir}
          oto={oto}
          setOto={setOto}
        />
      )}
      {oto === null && <Footer theme={theme} />}
    </ThemeProvider>
  );
};
