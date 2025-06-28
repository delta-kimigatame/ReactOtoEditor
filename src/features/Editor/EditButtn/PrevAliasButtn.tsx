import * as React from "react";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { LOG } from "../../../lib/Logging";
import { useOtoProjectStore } from "../../../store/otoProjectStore";

/**
 * 前のエイリアスに送るボタン
 * @param props
 * @returns 前のエイリアスに送るボタン
 */
export const PrevAliasButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const { record, targetDir, setRecord,oto } = useOtoProjectStore();
  /**
   * 前のエイリアスに送る処理
   */
  const OnPrevAlias_ = () => {
    OnPrevAlias(
      oto,
      targetDir,
      record,
      props.maxFileIndex,
      props.fileIndex,
      props.maxAliasIndex,
      props.aliasIndex,
      setRecord,
      props.setFileIndex,
      props.setAliasIndex,
      props.setMaxAliasIndex
    );
  };

  return (
    <>
      <EditorButton
        size={props.size}
        icon={<ArrowDropUpIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.prev")}
        onClick={OnPrevAlias_}
        disabled={
          (props.aliasIndex === 0 && props.fileIndex === 0) || props.progress
        }
      />
    </>
  );
};

interface Props {
  /** ボタンのサイズ */
  size: number;
  /** アイコンのサイズ */
  iconSize: number;
  /** 現在のファイルのインデックス */
  fileIndex: number;
  /** 現在のエイリアスのインデックス */
  aliasIndex: number;
  /** ファイル数 */
  maxFileIndex: number;
  /** 現在のファイルに登録されているエイリアス数 */
  maxAliasIndex: number;
  /** 現在のファイルのインデックスを変更する処理 */
  setFileIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のエイリアスのインデックスを変更する処理 */
  setAliasIndex: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のファイルに登録されているエイリアス数を変更する処理 */
  setMaxAliasIndex: React.Dispatch<React.SetStateAction<number>>;
  /** キャンバスの読込状態 */
  progress: boolean;
}

export const OnPrevAlias = (
  oto: Oto,
  targetDir: string,
  record: OtoRecord | null,
  maxFileIndex: number,
  fileIndex: number,
  maxAliasIndex: number,
  aliasIndex: number,
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>,
  setFileIndex: React.Dispatch<React.SetStateAction<number>>,
  setAliasIndex: React.Dispatch<React.SetStateAction<number>>,
  setMaxAliasIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  LOG.debug(
    `エイリアス変更前。maxFileIndex:${maxFileIndex}、fileIndex:${fileIndex}、maxAliasIndex:${maxAliasIndex}、aliasIndex:${aliasIndex}`,
    "PrevAliasButton"
  );
  if (aliasIndex === 0) {
    if (fileIndex !== 0) {
      const filename = oto.GetFileNames(targetDir)[fileIndex - 1];
      const maxAliases = oto.GetAliases(targetDir, filename).length - 1;
      const alias = oto.GetAliases(targetDir, filename)[maxAliases];
      setRecord(oto.GetRecord(targetDir, filename, alias));
      setFileIndex(fileIndex - 1);
      setAliasIndex(maxAliases);
      setMaxAliasIndex(maxAliases);
      LOG.debug(
        `エイリアス変更後。maxFileIndex:${maxFileIndex}、fileIndex:${
          fileIndex - 1
        }、maxAliasIndex:${maxAliases}、aliasIndex:${maxAliases}`,
        "PrevAliasButton"
      );
    }
  } else {
    const alias = oto.GetAliases(targetDir, record.filename)[aliasIndex - 1];
    setRecord(oto.GetRecord(targetDir, record.filename, alias));
    setAliasIndex(aliasIndex - 1);
    LOG.debug(
      `エイリアス変更前。maxFileIndex:${maxFileIndex}、fileIndex:${fileIndex}、maxAliasIndex:${maxAliasIndex}、aliasIndex:${
        aliasIndex - 1
      }`,
      "PrevAliasButton"
    );
  }
};
