import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { PrivacyPaper } from "./PrivacyPaper";
import { RulePaper } from "./RulePaper";
import { TopPaper } from "./TopPaper";
import { TargetDirDialog } from "../TargetDirDialog/TargetDirDialog";

import { Log } from "../Lib/Logging";

/**
 * zipデータを読み込む前の画面
 * @param props {@link TopViewProps}
 * @returns zipデータを読み込む前の画面
 */
export const TopView: React.FC<TopViewProps> = (props) => {
  /** 原音設定対象ディレクトリを選択するためのダイアログ表示設定 */
  const [targetDirDialogOpen, setTargetDirDialogOpen] =
    React.useState<boolean>(false);

  /**
   * zipの読込が完了した際の処理
   * zip内を探索し、wavがあればtargetDirsに登録する。
   */
  React.useEffect(() => {
    if (props.readZip === null) {
      props.setTargetDirs(null);
      props.setTargetDir(null);
      Log.log("targetDir初期化","TOPView")
    } else {
      const targetDirs: Array<string> = new Array();
      Object.keys(props.readZip).forEach((f) => {
        if (f.endsWith(".wav")) {
          const tmps = f.split("/").slice(0, -1).join("/");
          if (!targetDirs.includes(tmps)) {
            targetDirs.push(tmps);
          }
        }
      });
      props.setTargetDirs(targetDirs);
    }
  }, [props.readZip]);

  /**
   * `props.targetDirs`が変更されたときの処理。
   * readzip変更後のzip内全探査が終わった時に起動する想定。
   * 原音設定対象ディレクトリを選択するためのダイアログを表示する。
   */
  React.useEffect(() => {
    if (props.targetDirs !== null) {
      setTargetDirDialogOpen(true);
      Log.log(`targetDirs取得。${props.targetDirs}`,"TOPView")
    }
  }, [props.targetDirs]);

  return (
    <>
      <TopPaper
        readZip={props.readZip}
        setReadZip={props.setReadZip}
        setZipFileName={props.setZipFileName}
      />
      <RulePaper />
      <PrivacyPaper />
      <TargetDirDialog
        dialogOpen={targetDirDialogOpen}
        setDialogOpen={setTargetDirDialogOpen}
        targetDirs={props.targetDirs}
        targetDir={props.targetDir}
        setTargetDir={props.setTargetDir}
        oto={props.oto}
        setOto={props.setOto}
        readZip={props.readZip}
        zipFileName={props.zipFileName}
      />
    </>
  );
};

export interface TopViewProps {
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /** 読み込んだzipのデータを登録する処理 */
  setReadZip: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** zip内のwavファイルがあるディレクトリの一覧を変更する処理 */
  setTargetDirs: React.Dispatch<React.SetStateAction<Array<string> | null>>;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだファイル名を変更する処理 */
  setZipFileName: React.Dispatch<React.SetStateAction<string>>;
  /** zipのファイル名 */
  zipFileName:string
}
