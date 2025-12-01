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

import { FullWidthTextField } from "../../components/Common/FullWidthTextField";
import { LOG } from "../../lib/Logging";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { useOtoProjectStore } from "../../store/otoProjectStore";
import { ChangeAlias, DuplicateOtoRecord } from "../../utils/otoRecordUtils";

export const AliasDialog: React.FC<TableDialogProps> = (props) => {
  const { t } = useTranslation();
  const { targetDir, record, setRecord, oto } = useOtoProjectStore();
  /** aliasのtmp */
  const alias_ = record === null ? "" : record.alias;
  const [offset_, overlap_, pre_, velocity_, blank_] =
    record === null
      ? [0, 0, 0, 0, 0]
      : [
          record.offset,
          record.overlap,
          record.pre,
          record.velocity,
          record.blank,
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
    if (record !== null) {
      setAlias(record.alias);
      setOffset(record.offset);
      setOverlap(record.overlap);
      setPreutter(record.pre);
      setVelocity(record.velocity);
      setBlank(record.blank);
    }
  }, [record]);

  /**
   * エイリアスを変更する処理 \
   * 変更されたエイリアスはファイル内の最後のレコードとなる。 \
   * 変更されたエイリアスをrecordにセットする。
   */
  const OnChangeClick = () => {
    if (oto.HasOtoRecord(targetDir, record.filename, alias)) {
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.error"));
    } else {
      LOG.debug(
        `エイリアス変更。変更前:${record.alias}、変更後:${alias}`,
        "AliasDialog"
      );
      ChangeAlias(targetDir, record, alias, props.aliasIndex, oto);
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.change"));
      props.setDialogOpen(false);
      props.setAliasIndex(props.aliasIndex);
      setRecord(oto.GetRecord(targetDir, record.filename, alias));
      props.setUpdateSignal(Math.random());
    }
  };

  /**
   * エイリアスを複製する処理 \
   * 複製されたエイリアスはファイル内の最後のレコードとなる。 \
   * 複製されたエイリアスをrecordにセットする。
   */
  const OnDuplicationClick = () => {
    if (oto.HasOtoRecord(targetDir, record.filename, alias)) {
      setBarOpen(true);
      setBarText(t("aliasDialog.barText.error"));
    } else {
      LOG.debug(
        `エイリアス複製。複製元:${record.alias}、複製後:${alias}`,
        "AliasDialog"
      );
      DuplicateOtoRecord(targetDir, record, alias, props.aliasIndex, oto);

      setBarOpen(true);
      setBarText(t("aliasDialog.barText.duplication"));
      props.setDialogOpen(false);
      props.setMaxAliasIndex(props.maxAliasIndex + 1);
      props.setAliasIndex(props.aliasIndex + 1);
      setRecord(oto.GetRecord(targetDir, record.filename, alias));
      props.setUpdateSignal(Math.random());
    }
  };

  /**
   * エイリアスを削除する処理 \
   * 最後のエイリアスの場合1つ前、それ以外の場合1つ後ろのエイリアスをrecordにセットする。
   */
  const OnDeleteClick = () => {
    LOG.debug(`エイリアス削除。${record.alias}`, "AliasDialog");
    oto.RemoveAlias(targetDir, record.filename, record.alias);
    props.setDialogOpen(false);
    if (
      props.aliasIndex === props.maxAliasIndex &&
      props.fileIndex === props.maxFileIndex
    ) {
      // 最後のファイルの最後のインデックスの場合1つ手前を参照する。
      if (props.aliasIndex !== 0) {
        props.setAliasIndex(props.aliasIndex - 1);
        props.setMaxAliasIndex(props.maxAliasIndex - 1);
        const alias = oto.GetAliases(targetDir, record.filename)[
          props.aliasIndex - 1
        ];
        setRecord(oto.GetRecord(targetDir, record.filename, alias));
      } else if (props.fileIndex !== 0) {
        const filename = oto.GetFileNames(targetDir)[props.fileIndex - 1];
        const maxAliases = oto.GetAliases(targetDir, filename).length - 1;
        const alias = oto.GetAliases(targetDir, filename)[maxAliases];
        props.setFileIndex(props.fileIndex - 1);
        props.setAliasIndex(maxAliases);
        props.setMaxAliasIndex(maxAliases);
        setRecord(oto.GetRecord(targetDir, filename, alias));
      } else {
        //最後のエイリアスを削除
        props.setFileIndex(0);
        props.setAliasIndex(0);
        props.setMaxAliasIndex(0);
        setRecord(null);
      }
    } else if (props.aliasIndex === props.maxAliasIndex) {
      const filename = oto.GetFileNames(targetDir)[props.fileIndex + 1];
      const maxAliases = oto.GetAliases(targetDir, filename).length - 1;
      const alias = oto.GetAliases(targetDir, filename)[maxAliases];
      props.setFileIndex(props.fileIndex + 1);
      props.setAliasIndex(0);
      props.setMaxAliasIndex(maxAliases);
      setRecord(oto.GetRecord(targetDir, filename, alias));
    } else {
      props.setMaxAliasIndex(props.maxAliasIndex - 1);
      const alias = oto.GetAliases(targetDir, record.filename)[
        props.aliasIndex
      ];
      setRecord(oto.GetRecord(targetDir, record.filename, alias));
    }
    setBarOpen(true);
    setBarText(t("aliasDialog.barText.delete"));
  };

  const OnParameterChangeClick = () => {
    let update = false;
    if (offset !== record.offset) {
      record.offset = offset;
      update = true;
      LOG.debug(`オフセット変更。${record.offset}`, "AliasDialog");
    }
    if (overlap !== record.overlap) {
      record.overlap = overlap;
      update = true;
      LOG.debug(`オーバーラップ変更。${record.overlap}`, "AliasDialog");
    }
    if (preutter !== record.pre) {
      record.pre = preutter;
      update = true;
      LOG.debug(`先行発声変更。${record.pre}`, "AliasDialog");
    }
    if (velocity !== record.velocity) {
      record.velocity = velocity;
      update = true;
      LOG.debug(`子音部変更。${record.velocity}`, "AliasDialog");
    }
    if (blank !== record.blank) {
      record.blank = blank;
      update = true;
      LOG.debug(`右ブランク変更。${record.blank}`, "AliasDialog");
    }
    if (update) {
      props.setUpdateSignal(Math.random());
    }
    props.setDialogOpen(false);
  };
  return (
    <>
      <Dialog
        data-testid="AliasDialog-root"
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullScreen
      >
        <IconButton
          data-testid="AliasDialog-close"
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
            data-testid="AliasDialog-alias"
            type="text"
            label={t("aliasDialog.textField")}
            value={alias}
            onChange={(e) => {
              setAlias(e.target.value);
            }}
          />
          <Box sx={{ display: "flex" }}>
            <Button
              data-testid="AliasDialog-change"
              variant="contained"
              color="inherit"
              sx={{ m: 1, flexGrow: 1 }}
              onClick={OnChangeClick}
            >
              {t("aliasDialog.change")}
            </Button>
            <Button
              data-testid="AliasDialog-duplication"
              variant="contained"
              color="inherit"
              sx={{ m: 1, flexGrow: 1 }}
              onClick={OnDuplicationClick}
            >
              {t("aliasDialog.duplication")}
            </Button>
            <Button
              data-testid="AliasDialog-delete"
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
            data-testid="AliasDialog-offset"
            type="number"
            value={offset}
            label={t("oto.offset")}
            onChange={(e) => {
              setOffset(e.target.value);
            }}
          />
          <FullWidthTextField
            data-testid="AliasDialog-overlap"
            type="number"
            value={overlap}
            label={t("oto.overlap")}
            onChange={(e) => {
              setOverlap(e.target.value);
            }}
          />
          <FullWidthTextField
            data-testid="AliasDialog-preutter"
            type="number"
            value={preutter}
            label={t("oto.preutter")}
            onChange={(e) => {
              setPreutter(e.target.value);
            }}
          />
          <FullWidthTextField
            data-testid="AliasDialog-velocity"
            type="number"
            value={velocity}
            label={t("oto.velocity")}
            onChange={(e) => {
              setVelocity(e.target.value);
            }}
          />
          <FullWidthTextField
            data-testid="AliasDialog-blank"
            type="number"
            value={blank}
            label={t("oto.blank")}
            onChange={(e) => {
              setBlank(e.target.value);
            }}
          />
          <FullWidthButton
            data-testid="AliasDialog-paramchange"
            onClick={OnParameterChangeClick}
            disabled={record === null}
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
  setDialogOpen: (open: boolean) => void;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: (number: number) => void;
  /** 現在のファイルのインデックス */
  fileIndex: number;
  /** 現在のエイリアスのインデックス */
  aliasIndex: number;
  /** 現在のファイルに登録されているエイリアス数 */
  maxAliasIndex: number;
  /** 現在のotoに登録されているファイル数 */
  maxFileIndex: number;
  /** 現在のファイルのインデックスを変更する処理 */
  setFileIndex: (index: number) => void;
  /** 現在のエイリアスのインデックスを変更する処理 */
  setAliasIndex: (index: number) => void;
  /** 現在のファイルに登録されているエイリアス数を変更する処理 */
  setMaxAliasIndex: (max: number) => void;
}
