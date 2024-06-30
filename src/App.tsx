import * as React from "react";
import JSZip from "jszip";
import i18n from "./i18n/configs";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import useMediaQuery from "@mui/material/useMediaQuery";
import { PaletteMode } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookies } from "react-cookie";

import Paper from "@mui/material/Paper";

import { getDesignTokens } from "./settings/theme";
import { Header } from "./Header/Header";
import { Footer } from "./Fotter";
import { CanvasBase } from "./Editor/CanvasBase";
import { TopView } from "./Top/TopView";
import { fftSetting, layout } from "./settings/setting";
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
  const [zipFileName, setZipFileName] = React.useState<string>("");
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
  const [wav, setWav] = React.useState<Wave | null>(null);
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  /**
   * ダークモード設定が切り替わった際、クッキーに保存する。
   */
  const SetCookieMode = React.useMemo(() => setCookie("mode", mode), [mode]);
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

  React.useEffect(() => {
    if (record === null) {
      setWavFileName(null);
    } else {
      const storagedOto_: string | null = localStorage.getItem("oto");
      const storagedOto: {} =
        storagedOto_ === null ? {} : JSON.parse(storagedOto_);
      if (!(zipFileName in storagedOto)) {
        storagedOto[zipFileName] = {};
      }
      storagedOto[zipFileName][targetDir] = {
        oto: oto.GetLines()[targetDir].join("\r\n"),
        update_date: Date.now(),
      };
      localStorage.setItem("oto", JSON.stringify(storagedOto));
      if (wavFileName !== record.filename) {
        setWavFileName(record.filename);
      }
    }
  }, [record]);

  React.useEffect(() => {
    if (wavFileName === null) {
      setWav(null);
    } else if (readZip !== null) {
      if (Object.keys(readZip).includes(targetDir + "/" + wavFileName)) {
        readZip[targetDir + "/" + wavFileName]
          .async("arraybuffer")
          .then((result) => {
            const w = new Wave(result);
            w.channels = fftSetting.channels;
            w.bitDepth = fftSetting.bitDepth;
            w.sampleRate = fftSetting.sampleRate;
            w.RemoveDCOffset();
            w.VolumeNormalize();
            setWav(w);
          });
      } else {
        setWav(null);
      }
    }
  }, [wavFileName]);

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
          wav={wav}
          setRecord={setRecord}
          zip={readZip}
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
          setZipFileName={setZipFileName}
        />
      )}
      {oto === null && <Footer theme={theme} />}
    </ThemeProvider>
  );
};
