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
  const OnNextAlias_ = () => {
      OnNextAlias(
        props.oto,
        props.targetDir,
        props.record,
        props.maxFileIndex,
        props.fileIndex,
        props.maxAliasIndex,
        props.aliasIndex,
        props.setRecord,
        props.setFileIndex,
        props.setAliasIndex,
        props.setMaxAliasIndex
      );
  };

  return (
    <>
      <EditorButton
        mode={props.mode}
        size={props.size}
        icon={<ArrowDropDownIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.next")}
        onClick={OnNextAlias_}
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

export const OnNextAlias = (
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
  Log.log(
    `エイリアス変更前。maxFileIndex:${maxFileIndex}、fileIndex:${fileIndex}、maxAliasIndex:${maxAliasIndex}、aliasIndex:${aliasIndex}`,
    "NextAliasButton"
  );
  if (maxAliasIndex === aliasIndex) {
    if (maxFileIndex !== fileIndex) {
      const filename = oto.GetFileNames(targetDir)[
        fileIndex + 1
      ];
      const alias = oto.GetAliases(targetDir, filename)[0];
      setRecord(oto.GetRecord(targetDir, filename, alias));
      setFileIndex(fileIndex + 1);
      setAliasIndex(0);
      setMaxAliasIndex(
        oto.GetAliases(targetDir, filename).length - 1
      );
      Log.log(
        `エイリアス変更後。maxFileIndex:${maxFileIndex}、fileIndex:${
          fileIndex + 1
        }、maxAliasIndex:${
          oto.GetAliases(targetDir, filename).length - 1
        }、aliasIndex:${0}`,
        "NextAliasButton"
      );
    }
  } else {
    const alias = oto.GetAliases(targetDir, record.filename)[
      aliasIndex + 1
    ];
    setRecord(
      oto.GetRecord(targetDir, record.filename, alias)
    );
    setAliasIndex(aliasIndex + 1);
    Log.log(
      `エイリアス変更後。maxFileIndex:${maxFileIndex}、fileIndex:${
        fileIndex
      }、maxAliasIndex:${maxAliasIndex}、aliasIndex:${
        aliasIndex + 1
      }`,
      "NextAliasButton"
    );
  }
};
