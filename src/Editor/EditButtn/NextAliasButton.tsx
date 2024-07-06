import * as React from "react";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { EditorButton } from "./EditorButton";
import { Log } from "../../Lib/Logging";

/**
 * 次のエイリアスに送るボタン
 * @param props
 * @returns 次のエイリアスに送るボタン
 */
export const NextAliasButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  /**
   * 次のエイリアスに送る処理
   */
  const OnNextAlias = () => {
    Log.log(
      `エイリアス変更前。maxFileIndex:${props.maxFileIndex}、fileIndex:${props.fileIndex}、maxAliasIndex:${props.maxAliasIndex}、aliasIndex:${props.aliasIndex}`,
      "NextAliasButton"
    );
    if (props.maxAliasIndex === props.aliasIndex) {
      if (props.maxFileIndex !== props.fileIndex) {
        const filename = props.oto.GetFileNames(props.targetDir)[
          props.fileIndex + 1
        ];
        const alias = props.oto.GetAliases(props.targetDir, filename)[0];
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setFileIndex(props.fileIndex + 1);
        props.setAliasIndex(0);
        props.setMaxAliasIndex(
          props.oto.GetAliases(props.targetDir, filename).length - 1
        );
        Log.log(
          `エイリアス変更後。maxFileIndex:${props.maxFileIndex}、fileIndex:${
            props.fileIndex + 1
          }、maxAliasIndex:${
            props.oto.GetAliases(props.targetDir, filename).length - 1
          }、aliasIndex:${0}`,
          "NextAliasButton"
        );
      }
    } else {
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[props.aliasIndex + 1];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      props.setAliasIndex(props.aliasIndex + 1);
      Log.log(
        `エイリアス変更後。maxFileIndex:${props.maxFileIndex}、fileIndex:${
          props.fileIndex
        }、maxAliasIndex:${props.maxAliasIndex}、aliasIndex:${
          props.aliasIndex + 1
        }`,
        "NextAliasButton"
      );
    }
  };

  return (
    <>
      <EditorButton
        mode={props.mode}
        size={props.size}
        icon={<ArrowDropDownIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.next")}
        onClick={OnNextAlias}
        disabled={
          (props.maxAliasIndex === props.aliasIndex &&
            props.maxFileIndex === props.fileIndex) ||
          props.progress
        }
      />
    </>
  );
};

interface Props {
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** 原音設定データ */
  oto: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** recordを更新する処理 */
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
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
