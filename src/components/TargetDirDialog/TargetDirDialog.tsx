import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";

import { TargetDirDialogTitle } from "./TargetDirDialogTitle";
import { TargetDirDialogContent } from "../../features/TargetDirDialog/TargetDirDialogContent";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログ
 * @param props {@link TargetDirDialogProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログ
 */
export const TargetDirDialog: React.FC<TargetDirDialogProps> = (props) => {
  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullScreen
      >
        <TargetDirDialogTitle setDialogOpen={props.setDialogOpen} />
        <Divider />
        <TargetDirDialogContent
          setDialogOpen={props.setDialogOpen}
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
          oto={props.oto}
          setOto={props.setOto}
        />
      </Dialog>
    </>
  );
};

export interface TargetDirDialogProps {
  /** ダイアログを表示するか否か */
  dialogOpen: boolean;
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
};
