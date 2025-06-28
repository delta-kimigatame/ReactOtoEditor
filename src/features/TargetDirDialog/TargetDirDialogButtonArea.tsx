import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { LOG } from "../../lib/Logging";

import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { FullWidthSelect } from "../../components/Common/FullWidthSelect";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログの文字コードを設定するエリア
 * @param props {@link TargetDirDialogButtonAreaProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログの文字コードを設定するエリア
 */
export const TargetDirDialogButtonArea: React.FC<
  TargetDirDialogButtonAreaProps
> = (props) => {
  const { t } = useTranslation();
  const { setOto } = useOtoProjectStore();

  /**
   * 文字コードが変更されたときの処理。 \
   * 登録済みのoto.iniをnullにして指定した文字コードで再読み込みする。
   * @param e
   */
  const OnSelectChange = (e: SelectChangeEvent) => {
    LOG.debug(`文字コードの変更。${e.target.value}`, "TargetDirDialogButtonArea");
    props.setEncoding(e.target.value);
    props.setOtoTemp(null);
    props.LoadOto(e.target.value);
  };

  /**
   * 現在読み込んでいるoto.iniを親コンポーネントに返し、ダイアログを閉じる。
   */
  const OnSubmitClick = () => {
    LOG.debug(`oto.ini確定`, "TargetDirDialogButtonArea");
    Log.gtag("loadoto");
    setOto(props.oto);
    props.setDialogOpen(false);
  };

  return (
    <>
      <FullWidthButton onClick={OnSubmitClick}>
        {t("targetDirDialog.submit")}
      </FullWidthButton>
      <br />
      <FullWidthSelect
        label={t("loadZipDialog.encoding")}
        value={props.encoding}
        onChange={OnSelectChange}
      >
        <MenuItem value={"UTF8"}>UTF-8</MenuItem>
        <MenuItem value={"SJIS"}>Shift-JIS</MenuItem>
      </FullWidthSelect>
    </>
  );
};

export interface TargetDirDialogButtonAreaProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理。文字化け確認用 */
  setOtoTemp: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** oto.iniを読み込む処理 */
  LoadOto: (encoding_?: string) => void;
  /** oto.iniを読み込む際の文字コード */
  encoding: string;
  /** oto.iniを読み込む際の文字コードを変更する処理 */
  setEncoding: React.Dispatch<React.SetStateAction<string>>;
}
