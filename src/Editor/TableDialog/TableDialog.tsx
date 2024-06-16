import * as React from "react";
import JSZip from "jszip";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { EditorTable } from "../EditorTable";

export const TableDialog: React.FC<TableDialogProps> = (props) => {
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
        <DialogTitle>{t("tableDialog.title")}</DialogTitle>
        <DialogContent>
          <EditorTable
            windowWidth={props.windowWidth}
            windowHeight={props.windowHeight}
            oto={props.oto}
            record={props.record}
            targetDir={props.targetDir}
            updateSignal={props.updateSignal}
            fileIndex={props.fileIndex}
            aliasIndex={props.aliasIndex}
            setRecord={props.setRecord}
            setFileIndex={props.setFileIndex}
            setAliasIndex={props.setAliasIndex}
            setMaxAliasIndex={props.setMaxAliasIndex}
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
  /** 原音設定データ */
  oto: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** recordの更新通知 */
  updateSignal: number;
  /** recordを更新する処理 */
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
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
  /** zipデータ */
  zip: {
    [key: string]: JSZip.JSZipObject;
  } | null;
}
