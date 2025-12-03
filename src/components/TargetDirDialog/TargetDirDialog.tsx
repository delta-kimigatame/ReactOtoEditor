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
};
