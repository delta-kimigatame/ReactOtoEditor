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
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";

import { FullWidthTextField } from "../Common/FullWidthTextField";
import { Log } from "../Lib/Logging";
import { FullWidthButton } from "../Common/FullWidthButton";

export const AliasDialog: React.FC<TableDialogProps> = (props) => {
  const { t } = useTranslation();
  /** aliasのtmp */
  const alias_ = props.record === null ? "" : props.record.alias;
  const [offset_, overlap_, pre_, velocity_, blank_] =
    props.record === null
      ? [0, 0, 0, 0, 0]
      : [
          props.record.offset,
          props.record.overlap,
          props.record.pre,
          props.record.velocity,
          props.record.blank,
        ];
  const [offset, setOffset] = React.useState<number>(offset_);
  const [overlap, setOverlap] = React.useState<number>(overlap_);
  const [preutter, setPreutter] = React.useState<number>(pre_);
  const [velocity, setVelocity] = React.useState<number>(velocity_);
  const [blank, setBlank] = React.useState<number>(blank_);
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
      setOffset(props.record.offset);
      setOverlap(props.record.overlap);
      setPreutter(props.record.pre);
      setVelocity(props.record.velocity);
      setBlank(props.record.blank);
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
      Log.log(
        `エイリアス変更。変更前:${props.record.alias}、変更後:${alias}`,
        "AliasDialog"
      );
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
      Log.log(
        `エイリアス複製。複製元:${props.record.alias}、複製後:${alias}`,
        "AliasDialog"
      );
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
    Log.log(`エイリアス削除。${props.record.alias}`, "AliasDialog");
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

  const OnParameterChangeClick = () => {
    let update = false;
    if (offset !== props.record.offset) {
      props.record.offset = offset;
      update = true;
      Log.log(`オフセット変更。${props.record.offset}`, "AliasDialog");
    }
    if (overlap !== props.record.overlap) {
      props.record.overlap = overlap;
      update = true;
      Log.log(`オーバーラップ変更。${props.record.overlap}`, "AliasDialog");
    }
    if (preutter !== props.record.pre) {
      props.record.pre = preutter;
      update = true;
      Log.log(`先行発声変更。${props.record.pre}`, "AliasDialog");
    }
    if (velocity !== props.record.velocity) {
      props.record.velocity = velocity;
      update = true;
      Log.log(`子音部変更。${props.record.velocity}`, "AliasDialog");
    }
    if (blank !== props.record.blank) {
      props.record.blank = blank;
      update = true;
      Log.log(`右ブランク変更。${props.record.blank}`, "AliasDialog");
    }
    if (update) {
      props.setUpdateSignal(Math.random());
    }
    props.setDialogOpen(false);
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
          <Divider />
          <FullWidthTextField
            type="number"
            value={offset}
            label={t("oto.offset")}
            onChange={(e) => {
              setOffset(e.target.value);
            }}
          />
          <FullWidthTextField
            type="number"
            value={overlap}
            label={t("oto.overlap")}
            onChange={(e) => {
              setOverlap(e.target.value);
            }}
          />
          <FullWidthTextField
            type="number"
            value={preutter}
            label={t("oto.preutter")}
            onChange={(e) => {
              setPreutter(e.target.value);
            }}
          />
          <FullWidthTextField
            type="number"
            value={velocity}
            label={t("oto.velocity")}
            onChange={(e) => {
              setVelocity(e.target.value);
            }}
          />
          <FullWidthTextField
            type="number"
            value={blank}
            label={t("oto.blank")}
            onChange={(e) => {
              setBlank(e.target.value);
            }}
          />
          <FullWidthButton
            onClick={OnParameterChangeClick}
            disabled={props.record === null}
          >
            {t("aliasDialog.change")}
          </FullWidthButton>
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
