import * as React from "react";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import { FullWidthTextField } from "../../Common/FullWidthTextField";

export const AliasDialog: React.FC<TableDialogProps> = (props) => {
  const { t } = useTranslation();
  /** aliasのtmp */
  const alias_ = props.record === null ? "" : props.record.alias;
  /** テキストフィールドで編集できるalias */
  const [alias, setAlias] = React.useState<string>(alias_);
  /** スナックバーの表示 */
  const [barOpen, setBarOpen] = React.useState<boolean>(false);
  /** スナックバーに表示するテキスト */
  const [barText, setBarText] = React.useState<string>("");

  /** 外部からrecordが変更された際にaliasを変更する。 */
  React.useEffect(() => {
    if (props.record !== null) {
      setAlias(props.record.alias);
    }
  }, [props.record]);

  /**
   * エイリアスを変更する処理 \
   * 変更されたエイリアスはファイル内の最後のレコードとなる。 \
   * 変更されたエイリアスをrecordにセットする。
   */
  const OnChangeClick = () => {
    if (props.oto.HasOtoRecord(props.targetDir, props.record.filename, alias)) {
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.error"));
    } else {
      props.oto.SetAlias(
        props.targetDir,
        props.record.filename,
        props.record.alias,
        alias
      );
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.change"));
      props.setDialogOpen(false);
      props.setAliasIndex(props.maxAliasIndex);
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      props.setUpdateSignal(Math.random());
    }
  };

  /**
   * エイリアスを複製する処理 \
   * 複製されたエイリアスはファイル内の最後のレコードとなる。 \
   * 複製されたエイリアスをrecordにセットする。
   */
  const OnDuplicationClick = () => {
    if (props.oto.HasOtoRecord(props.targetDir, props.record.filename, alias)) {
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.error"));
    } else {
      props.oto.SetParams(
        props.targetDir,
        props.record.filename,
        alias,
        props.record.offset,
        props.record.overlap,
        props.record.pre,
        props.record.velocity,
        props.record.blank
      );
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.duplication"));
      props.setDialogOpen(false);
      props.setMaxAliasIndex(props.maxAliasIndex + 1);
      props.setAliasIndex(props.maxAliasIndex + 1);
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      props.setUpdateSignal(Math.random());
    }
  };

  /**
   * エイリアスを削除する処理 \
   * 最後のエイリアスの場合1つ前、それ以外の場合1つ後ろのエイリアスをrecordにセットする。
   */
  const OnDeleteClick = () => {
    props.oto.RemoveAlias(
      props.targetDir,
      props.record.filename,
      props.record.alias
    );
    props.setDialogOpen(false);
    if (
      props.aliasIndex === props.maxAliasIndex &&
      props.fileIndex === props.maxFileIndex
    ) {
      // 最後のファイルの最後のインデックスの場合1つ手前を参照する。
      if (props.aliasIndex !== 0) {
        props.setAliasIndex(props.aliasIndex - 1);
        props.setMaxAliasIndex(props.maxAliasIndex - 1);
        const alias = props.oto.GetAliases(
          props.targetDir,
          props.record.filename
        )[props.aliasIndex - 1];
        props.setRecord(
          props.oto.GetRecord(props.targetDir, props.record.filename, alias)
        );
      } else if (props.fileIndex !== 0) {
        const filename = props.oto.GetFileNames(props.targetDir)[
          props.fileIndex - 1
        ];
        const maxAliases =
          props.oto.GetAliases(props.targetDir, filename).length - 1;
        const alias = props.oto.GetAliases(props.targetDir, filename)[
          maxAliases
        ];
        props.setFileIndex(props.fileIndex - 1);
        props.setAliasIndex(maxAliases);
        props.setMaxAliasIndex(maxAliases);
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
      } else {
        //最後のエイリアスを削除
        props.setFileIndex(0);
        props.setAliasIndex(0);
        props.setMaxAliasIndex(0);
        props.setRecord(null);
      }
    } else if (props.aliasIndex === props.maxAliasIndex) {
      const filename = props.oto.GetFileNames(props.targetDir)[
        props.fileIndex + 1
      ];
      const maxAliases =
        props.oto.GetAliases(props.targetDir, filename).length - 1;
      const alias = props.oto.GetAliases(props.targetDir, filename)[maxAliases];
      props.setFileIndex(props.fileIndex + 1);
      props.setAliasIndex(0);
      props.setMaxAliasIndex(maxAliases);
      props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
    } else {
      props.setMaxAliasIndex(props.maxAliasIndex - 1);
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[props.aliasIndex];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
    }
    setBarOpen(true);
    setBarText(t("aliasDialog.barText.delete"));
  };
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
        <DialogTitle>{t("aliasDialog.title")}</DialogTitle>
        <DialogContent>
          <FullWidthTextField
            type="text"
            label={t("aliasDialog.textField")}
            value={alias}
            onChange={(e) => {
              setAlias(e.target.value);
            }}
          />
          <Box sx={{ display: "flex" }}>
            <Button
              variant="contained"
              color="inherit"
              sx={{ m: 1, flexGrow: 1 }}
              onClick={OnChangeClick}
            >
              {t("aliasDialog.change")}
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{ m: 1, flexGrow: 1 }}
              onClick={OnDuplicationClick}
            >
              {t("aliasDialog.duplication")}
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ m: 1, flexGrow: 1 }}
              onClick={OnDeleteClick}
            >
              {t("aliasDialog.delete")}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={barOpen}
        autoHideDuration={1000}
        onClose={() => {
          setBarOpen(false);
        }}
        message={barText}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export interface TableDialogProps {
  /** ダイアログを表示するか否か */
  dialogOpen: boolean;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 原音設定データ */
  oto: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** recordを更新する処理 */
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
  /** 現在のファイルのインデックス */
  fileIndex: number;
  /** 現在のエイリアスのインデックス */
  aliasIndex: number;
  /** 現在のファイルに登録されているエイリアス数 */
  maxAliasIndex: number;
  /** 現在のotoに登録されているファイル数 */
  maxFileIndex: number;
  /** 現在のファイルのインデックスを変更する処理 */
  setFileIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のエイリアスのインデックスを変更する処理 */
  setAliasIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のファイルに登録されているエイリアス数を変更する処理 */
  setMaxAliasIndex: React.Dispatch<React.SetStateAction<number>>;
}
