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
import { getDesignTokens } from "./settings/theme";

import { Header } from "./Header/Header";
import { Footer } from "./Fotter";
import { TopView } from "./Top/TopView";
import { fftSetting, layout } from "./settings/setting";
import { EditorView } from "./Editor/EditorView";

import { Log } from "./Lib/Logging";
import { GetStorageOto, SaveStorageOto } from "./Lib/StorageOto";

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
  const SetCookieMode = React.useMemo(() => {
    setCookie("mode", mode);
    Log.log(mode + ":モードを変更", "App");
  }, [mode]);
  React.useMemo(() => {
    setCookie("color", color);
    Log.log(color + ":表示色を変更", "App");
  }, [color]);
  React.useMemo(() => {
    setCookie("language", language);
    i18n.changeLanguage(language);
    Log.log(language + ":表示言語を変更", "App");
  }, [language]);

  const [windowSize, setWindowSize] = React.useState<[number, number]>([0, 0]);
  React.useLayoutEffect(() => {
    Log.log(window.navigator.userAgent, "App");
    const updateSize = (): void => {
      setTimeout(()=>{
        setWindowSize([window.innerWidth, window.innerHeight]);
        Log.log("画面サイズ:" + [window.innerWidth, window.innerHeight], "App");
      },100)
    };
    window.addEventListener("orientationchange", updateSize); 
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  React.useEffect(() => {
    if (oto === null) {
      setRecord(null);
      setWavFileName(null);
      Log.log("otoを初期化", "App");
    } else {
      const filename: string = oto.GetFileNames(targetDir)[0];
      const alias: string = oto.GetAliases(targetDir, filename)[0];
      const r: OtoRecord = oto.GetRecord(targetDir, filename, alias);
      setWavFileName(filename);
      setRecord(r);
      Log.log(
        `otoの読込完了。初期ファイルネーム:${filename}、初期エイリアス:${alias}`,
        "App"
      );
    }
  }, [oto]);

  React.useEffect(() => {
    if (record === null) {
      setWavFileName(null);
      Log.log("recordを初期化", "App");
    } else {
      const storagedOto: {} = GetStorageOto();
      SaveStorageOto(storagedOto, oto, zipFileName, targetDir);
      if (wavFileName !== record.filename) {
        setWavFileName(record.filename);
      }
    }
    Log.log("localstorageに保存", "App");
  }, [record]);

  React.useEffect(() => {
    if (wavFileName === null) {
      setWav(null);
      Log.log("wavを初期化", "App");
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
            Log.log(`wav読込完了。${targetDir + "/" + wavFileName}`, "App");
          });
      } else {
        Log.log(
          `zip内にwavが見つかりませんでした。${targetDir + "/" + wavFileName}`,
          "App"
        );
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
        readZip={readZip}
        targetDirs={targetDirs}
        targetDir={targetDir}
        setTargetDir={setTargetDir}
        oto={oto}
        setOto={setOto}
        zipFileName={zipFileName}
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
          zipFileName={zipFileName}
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
          zipFileName={zipFileName}
          setZipFileName={setZipFileName}
        />
      )}
      {oto === null && <Footer theme={theme} />}
    </ThemeProvider>
  );
};
