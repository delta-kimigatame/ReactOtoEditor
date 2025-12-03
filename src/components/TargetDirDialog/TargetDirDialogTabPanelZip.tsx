import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import TabPanel from "@mui/lab/TabPanel";

import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "../../features/TargetDirDialog/TargetDirDialogButtonArea";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * zip内からoto.iniを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelZipProps}
 * @returns zip内からoto.iniを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelZip: React.FC<
  TargetDirDialogTabPanelZipProps
> = (props) => {
  const { t } = useTranslation();
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");

  const { oto } = useOtoProjectStore();
  return (
    <TabPanel value="1" sx={{ p: 0 }}>
      {props.nothingOto ? (
        <>
          <Typography>{t("targetDirDialog.nothingOto")}</Typography>
        </>
      ) : props.oto !== null ? (
        <>
          <TargetDirDialogButtonArea
            oto={props.oto}
            setOtoTemp={props.setOtoTemp}
            setDialogOpen={props.setDialogOpen}
            LoadOto={props.LoadOto}
            encoding={encoding}
            setEncoding={setEncoding}
          />
          <Divider />
          <TargetDirDialogCheckList oto={props.oto} />
        </>
      ) : (
        <Box sx={{ textAlign: "center", minHeight: 150 }}>
          <CircularProgress size={100} sx={{ maxWidth: "100%" }} />
        </Box>
      )}
    </TabPanel>
  );
};

export interface TargetDirDialogTabPanelZipProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 読み込んだoto.iniのデータを変更する処理。文字化け確認用 */
  setOtoTemp: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** oto.iniを読み込む処理 */
  LoadOto: (string) => void;
  /** zip内のoto.iniの有無 */
  nothingOto: boolean;
  /** 仮に読み込んだoto.iniのデータ */
  oto: Oto;
}
