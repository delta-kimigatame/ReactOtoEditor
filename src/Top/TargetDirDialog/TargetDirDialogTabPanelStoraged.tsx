import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";

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
  const [storagedOto, setStoragedOto] = React.useState<{}>({});

  React.useEffect(() => {
    const storagedOto__ = storagedOto_ === null ? {} : JSON.parse(storagedOto_);
    setStoragedOto(storagedOto__);
  }, []);
  const [selectHistory, setSelectHistory] = React.useState<string>(null);
  const OnSelectChange = (e: SelectChangeEvent) => {
    setSelectHistory(e.target.value);
    const [tmp, i, j, _] = e.target.value.split("_");
    const f = Object.keys(storagedOto)[parseInt(i)];
    const d = Object.keys(storagedOto[f])[parseInt(j)];
    const oto_ = new Oto();
    oto_
      .InputOtoAsync(
        props.targetDir,
        new Blob([storagedOto[f][d]["oto"]], { type: "text/plain" }),
        "UTF-8"
      )
      .then(() => {
        props.setOtoTemp(oto_);
      });
  };

  /**
   * 現在読み込んでいるoto.iniを親コンポーネントに返し、ダイアログを閉じる。
   */
  const OnSubmitClick = () => {
    props.setOto(props.oto);
    props.setDialogOpen(false);
  };
  return (
    <TabPanel value="2" sx={{ p: 0 }}>
      {storagedOto_ === null ? (
        <>
          <Typography>{t("targetDirDialog.NothingHistory")}</Typography>
        </>
      ) : (
        <>
          {" "}
          <Button
            fullWidth
            variant="contained"
            sx={{ m: 1 }}
            onClick={OnSubmitClick}
            size="large"
            color="inherit"
            disabled={props.oto===null}
          >
            {t("targetDirDialog.submit")}
          </Button>
          <br />
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel>{t("targetDirDialog.readHistory")}</InputLabel>
            <Select
              label="selectHistory"
              variant="filled"
              defaultValue=""
              value={selectHistory}
              onChange={OnSelectChange}
            >
              {Object.keys(storagedOto).map((f, i) =>
                Object.keys(storagedOto[f]).map((d, j) => (
                  <MenuItem value={"t_" + i + "_" + j}>
                    {f}
                    <br />
                    {d} ({storagedOto[f][d]["update_date"]})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {props.oto !== null && (
            <>
              <Divider />
              <TargetDirDialogCheckList
                oto={props.oto}
                targetDir={props.targetDir}
              />
            </>
          )}
        </>
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
  zipFileName: string;
}
