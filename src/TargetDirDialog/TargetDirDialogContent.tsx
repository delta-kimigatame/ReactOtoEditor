import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

import { TargetDirDialogSelectDir } from "./TargetDirDialogSelectDir";
import { TargetDirDialogTabPanelZip } from "./TargetDirDialogTabPanelZip";
import { TargetDirDialogTabPanelStoraged } from "./TargetDirDialogTabPanelStoraged";
import { TargetDirDialogTabPanelTemplate } from "./TargetDirDialogTabPanelTemplate";

import { Log } from "../Lib/Logging";
import { TargetDirDialogTabMakePanel } from "./TargetDirDialogTabMakePanel";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ
 * @param props {@link TargetDirDialogContentProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ
 */
export const TargetDirDialogContent: React.FC<TargetDirDialogContentProps> = (
  props
) => {
  const { t } = useTranslation();
  /** oto.iniがディレクトリ内に存在するか否か */
  const [nothingOto, setNothingOto] = React.useState<boolean>(false);
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOto] = React.useState<Oto | null>(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");
  /** tabの表示を切り替える */
  const [tabIndex, setTabIndex] = React.useState<string>("1");

  /** `props.targetDir`が変更されたとき、oto.iniの読込を行う。 */
  React.useEffect(() => {
    if (props.targetDir === null) return;
    if (props.readZip === null) return;
    setNothingOto(false);
    Log.log(`targetDirの変更。${props.targetDir}`, "TargetDirDialogContent");
    LoadOto();
  }, [props.targetDir]);

  /**
   * oto.iniを読み込む。
   * @param encoding_ 文字コード
   */
  const LoadOto = (encoding_: string = "SJIS") => {
    const otoPath=props.targetDir===""?"oto.ini":props.targetDir + "/oto.ini"
    if (Object.keys(props.readZip).includes(otoPath)) {
      Log.log(
        `${otoPath}読込。文字コード:${encoding_}`,
        "TargetDirDialogContent"
      );
      props.readZip[otoPath]
        .async("arraybuffer")
        .then((result) => {
          const oto = new Oto();
          oto
            .InputOtoAsync(
              props.targetDir,
              new Blob([result], { type: "text/plain" }),
              encoding_
            )
            .then(() => {
              Log.log(
                `${otoPath}読込完了`,
                "TargetDirDialogContent"
              );
              setOto(oto);
              setTabIndex("1");
            });
        });
    } else {
      Log.log(
        `${props.targetDir}内にoto.iniが見つかりませんでした。`,
        "TargetDirDialogContent"
      );
      setNothingOto(true);
      setTabIndex("2");
    }
  };

  const OnTabChange = (e: React.SyntheticEvent, newValue: string) => {
    Log.log(`tabpanel変更。${newValue}`, "TargetDirDialogContent");
    setTabIndex(newValue);
  };
  return (
    <>
      <DialogContent>
        <TargetDirDialogSelectDir
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
        />
        <Divider />
        <Box sx={{ p: 1 }}>
          {props.targetDir !== null && (
            <>
              <TabContext value={tabIndex}>
                <TabList
                  onChange={OnTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab value="1" label={t("targetDirDialog.tab.zip")} />
                  <Tab value="2" label={t("targetDirDialog.tab.storaged")} />
                  <Tab value="3" label={t("targetDirDialog.tab.template")} />
                  <Tab value="4" label={t("targetDirDialog.tab.make")} />
                </TabList>
                <TargetDirDialogTabPanelZip
                  oto={oto}
                  setOto={props.setOto}
                  setOtoTemp={setOto}
                  setDialogOpen={props.setDialogOpen}
                  LoadOto={LoadOto}
                  targetDir={props.targetDir}
                  nothingOto={nothingOto}
                />
                <TargetDirDialogTabPanelStoraged
                  setDialogOpen={props.setDialogOpen}
                  targetDir={props.targetDir}
                  setOto={props.setOto}
                  zipFileName={props.zipFileName}
                />
                <TargetDirDialogTabPanelTemplate
                  setDialogOpen={props.setDialogOpen}
                  setOto={props.setOto}
                  targetDir={props.targetDir}
                />
                <TargetDirDialogTabMakePanel
                  setDialogOpen={props.setDialogOpen}
                  setOto={props.setOto}
                  targetDir={props.targetDir}
                  readZip={props.readZip}
                />
              </TabContext>
            </>
          )}
        </Box>
      </DialogContent>
    </>
  );
};

export interface TargetDirDialogContentProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /** zipのファイル名 */
  zipFileName: string;
}
