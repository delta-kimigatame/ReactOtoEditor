import * as React from "react";
import JSZip from "jszip";
import { useTranslation } from "react-i18next";

import MenuItem from "@mui/material/MenuItem";
import DialogContent from "@mui/material/DialogContent";
import { SelectChangeEvent } from "@mui/material/Select";

import { FullWidthSelect } from "../../components/Common/FullWidthSelect";

/**
 * zipをダウンロードするダイアログのコンテンツ部分
 * @param props {@link DownloadZipDialogContentProps}
 * @returns zipをダウンロードするダイアログのコンテンツ部分
 */
export const DownloadZipDialogContent: React.FC<
  DownloadZipDialogContentProps
> = (props) => {
  /**
   * セレクトボックスを変更した際の処理
   * @param e イベント
   * @param i インデックス
   */
  const OnSelectChange = (e: SelectChangeEvent<number>, i: number) => {
    const targetList_ = props.targetList.slice();
    targetList_[i] = e.target.value as number;
    props.setTargetList(targetList_);
  };

  const { t } = useTranslation();
  return (
    <>
      <DialogContent>
        {props.targetList !== null &&
          props.targetDirs.map((td, i) => (
            <>
              <FullWidthSelect
                label={td}
                value={props.targetList[i]}
                onChange={(e) => {
                  OnSelectChange(e, i);
                }}
              >
                {td === props.targetDir && (
                  <MenuItem value={0}>
                    {t("downloadZipDialog.current")}
                  </MenuItem>
                )}
                {td in props.storagedOto && (
                  <MenuItem value={1}>
                    {t("downloadZipDialog.storaged")}{" "}
                    {props.storagedOto[td]["update_date"]}
                  </MenuItem>
                )}
                {Object.keys(props.readZip).includes(td + "/oto.ini") && (
                  <MenuItem value={2}>{t("downloadZipDialog.readed")}</MenuItem>
                )}
                <MenuItem value={3}>{t("downloadZipDialog.none")}</MenuItem>
              </FullWidthSelect>
            </>
          ))}
      </DialogContent>
    </>
  );
};

export interface DownloadZipDialogContentProps {
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /** 保存されたoto.ini */
  storagedOto: {};
  /** 書き出すotoの対象リスト */
  targetList: Array<number> | null;
  /** 書き出すotoの対象リストを更新する処理 */
  setTargetList: React.Dispatch<React.SetStateAction<Array<number> | null>>;
}
