import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TabPanel from "@mui/lab/TabPanel";
import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";

/**
 * 履歴からoto.iniを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelStoragedProps}
 * @returns 履歴からoto.iniを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelStoraged: React.FC<
  TargetDirDialogTabPanelStoragedProps
> = (props) => {
  const { t } = useTranslation();
  const storagedOto_: string | null = localStorage.getItem("oto");
  const storagedOto = storagedOto_ === null ? {} : JSON.parse(storagedOto_);
  return (
    <TabPanel value="2" sx={{ p: 0 }}>
      {storagedOto_ === null ? (
        <>
          <Typography>{t("targetDirDialog.NothingHistory")}</Typography>
        </>
      ) : (
        <></>
      )}
    </TabPanel>
  );
};

export interface TargetDirDialogTabPanelStoragedProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだoto.iniのデータを変更する処理。文字化け確認用 */
  setOtoTemp: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** zipのファイル名 */
  zipFileName:string
}
