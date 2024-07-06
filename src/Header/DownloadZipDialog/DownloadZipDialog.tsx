import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Dialog from "@mui/material/Dialog";

import { DownloadZipDialogContent } from "./DownloadZipDialogContent";
import { DownloadZipDialogTitle } from "./DownloadZipDialogTitle";

/**
 * zipをダウンロードするダイアログ
 * @param props {@link DownloadZipDialogProps}
 * @returns zipをダウンロードするダイアログ
 */
export const DownloadZipDialog: React.FC<DownloadZipDialogProps> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullScreen
      >
        <DownloadZipDialogTitle
          targetDirs={props.targetDirs}
          readZip={props.readZip}
          oto={props.oto}
          setMenuAnchor={props.setMenuAnchor}
          zipFileName={props.zipFileName}
          setDialogOpen={props.setDialogOpen}
          storagedOto={props.storagedOto}
          targetList={props.targetList}
          setTargetList={props.setTargetList}
        />
        <DownloadZipDialogContent
          targetDirs={props.targetDirs}
          readZip={props.readZip}
          targetDir={props.targetDir}
          storagedOto={props.storagedOto}
          targetList={props.targetList}
          setTargetList={props.setTargetList}
        />
      </Dialog>
    </>
  );
};

export interface DownloadZipDialogProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  /** zipのファイル名 */
  zipFileName: string;
  /** ダイアログを表示するか否か */
  dialogOpen: boolean;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 保存されたoto.ini */
  storagedOto: {};
  /** 書き出すotoの対象リスト */
  targetList: Array<number> | null;
  /** 書き出すotoの対象リストを更新する処理 */
  setTargetList: React.Dispatch<React.SetStateAction<Array<number> | null>>;
}
