import * as React from "react";
import JSZip from "jszip";
import i18n from "../i18n/configs";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useCookieStore } from "../store/cookieStore";
import { getDesignTokens } from "../config/theme";

import { Header } from "./Header/Header";
import { Footer } from "../components/Fotter";
import { TopView } from "../components/Top/TopView";
import { fftSetting, layout } from "../config/setting";
import { EditorView } from "./Editor/EditorView";

import { Log } from "../lib/Logging";
import { GetStorageOto, SaveStorageOto } from "../services/StorageOto";
import { useInitializeApp } from "../hooks/useInitializeApp";
import { useThemeMode } from "../hooks/useThemeMode";
import { useOtoProjectStore } from "../store/otoProjectStore";
declare const __BUILD_TIMESTAMP__: string;

/**
 * Reactのエンドポイント
 * @returns 全体のjsx
 */
export const App: React.FC = () => {
  useInitializeApp();
  const mode_ = useThemeMode();
  const { language } = useCookieStore();
  const { zipFileName, readZip, targetDir, setWav, record, setRecord } =
    useOtoProjectStore();
  const [oto, setOto] = React.useState<Oto | null>(null);
  const [wavFileName, setWavFileName] = React.useState<string | null>(null);
  const theme = React.useMemo(
    () => createTheme(getDesignTokens(mode_)),
    [mode_]
  );
  React.useMemo(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);

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
      Log.gtag("changeRecord");
    }
    Log.log("localstorageに保存", "App");
  }, [record]);

  React.useEffect(() => {
    if (wavFileName === null) {
      setWav(null);
      Log.log("wavを初期化", "App");
    } else if (readZip !== null) {
      const wPath =
        targetDir === "" ? wavFileName : targetDir + "/" + wavFileName;
      if (Object.keys(readZip).includes(wPath)) {
        readZip[wPath].async("arraybuffer").then((result) => {
          const w = new Wave(result);
          w.channels = fftSetting.channels;
          w.bitDepth = fftSetting.bitDepth;
          w.sampleRate = fftSetting.sampleRate;
          w.RemoveDCOffset();
          w.VolumeNormalize();
          setWav(w);
          Log.log(`wav読込完了。${wPath}`, "App");
        });
      } else {
        Log.log(`zip内にwavが見つかりませんでした。${wPath}`, "App");
        setWav(null);
      }
    }
  }, [wavFileName]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header oto={oto} setOto={setOto} />
      {oto !== null && <EditorView oto={oto} />}
      {oto === null && <TopView oto={oto} setOto={setOto} />}
      {oto === null && <Footer theme={theme} />}
    </ThemeProvider>
  );
};
