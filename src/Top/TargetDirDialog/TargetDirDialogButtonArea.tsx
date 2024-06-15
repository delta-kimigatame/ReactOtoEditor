import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログの文字コードを設定するエリア
 * @param props {@link TargetDirDialogButtonAreaProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログの文字コードを設定するエリア
 */
export const TargetDirDialogButtonArea: React.FC<TargetDirDialogButtonAreaProps> = (props) => {
  const { t } = useTranslation();

  /**
   * 文字コードが変更されたときの処理。 \
   * 登録済みのoto.iniをnullにして指定した文字コードで再読み込みする。
   * @param e 
   */
  const OnSelectChange = (e: SelectChangeEvent) => {
    props.setEncoding(e.target.value);
    props.setOtoTemp(null);
    props.LoadOto(e.target.value);
  };

  /**
   * 現在読み込んでいるoto.iniを親コンポーネントに返し、ダイアログを閉じる。
   */
  const OnSubmitClick = () => {
    props.setOto(props.oto);
    props.setDialogOpen(false);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        sx={{ m: 1 }}
        onClick={OnSubmitClick}
        size="large"
        color="inherit"
      >
        {t("targetDirDialog.submit")}
      </Button>
      <br />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel>{t("loadZipDialog.encoding")}</InputLabel>
        <Select
          label={"encoding"}
          variant="filled"
          color="primary"
          value={props.encoding}
          onChange={OnSelectChange}
        >
          <MenuItem value={"UTF8"}>UTF-8</MenuItem>
          <MenuItem value={"SJIS"}>Shift-JIS</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export interface TargetDirDialogButtonAreaProps{
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだoto.iniのデータを変更する処理。文字化け確認用 */
  setOtoTemp: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** oto.iniを読み込む処理 */
  LoadOto: (encoding_?: string) => void;
  /** oto.iniを読み込む際の文字コード */
  encoding:string;
  /** oto.iniを読み込む際の文字コードを変更する処理 */
  setEncoding:React.Dispatch<React.SetStateAction<string>>
};
