import * as React from "react";
import { useTranslation } from "react-i18next";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";

import { EditorTable } from "../Editor/EditorTable";
import { TableDialogButtonArea } from "./TableDialogButtonArea";

export const TableDialog: React.FC<TableDialogProps> = (props) => {
  const { t } = useTranslation();
  const [updateSignal, setUpdateSignal ] = React.useState<number>(0);
  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullScreen
      >
        <IconButton
          onClick={() => {
            props.setDialogOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogTitle>
          {t("tableDialog.title")}
          <TableDialogButtonArea
            setDialogOpen={props.setDialogOpen}
            setUpdateSignal={setUpdateSignal}
          />
        </DialogTitle>
        <DialogContent>
          <EditorTable
            windowWidth={props.windowWidth}
            windowHeight={props.windowHeight}
            updateSignal={updateSignal}
            fileIndex={props.fileIndex}
            aliasIndex={props.aliasIndex}
            setFileIndex={props.setFileIndex}
            setAliasIndex={props.setAliasIndex}
            setMaxAliasIndex={props.setMaxAliasIndex}
            showAllRecords={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export interface TableDialogProps {
  /** ダイアログを表示するか否か */
  dialogOpen: boolean;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 画面の横幅 */
  windowWidth: number;
  /** 画面の縦幅 */
  windowHeight: number;
  /** recordの更新通知 */
  updateSignal: number;
  /** 現在のファイルのインデックス */
  fileIndex: number;
  /** 現在のエイリアスのインデックス */
  aliasIndex: number;
  /** 現在のファイルのインデックスを変更する処理 */
  setFileIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のエイリアスのインデックスを変更する処理 */
  setAliasIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のファイルに登録されているエイリアス数を変更する処理 */
  setMaxAliasIndex: React.Dispatch<React.SetStateAction<number>>;
}
