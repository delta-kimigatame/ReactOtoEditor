import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { TargetDirDialogCheckList } from "../../components/TargetDirDialog/TargetDirDialogCheckList";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { FullWidthSelect } from "../../components/Common/FullWidthSelect";

import { LOG } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * 履歴からoto.iniを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelStoragedProps}
 * @returns 履歴からoto.iniを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelStoraged: React.FC<
  TargetDirDialogTabPanelStoragedProps
> = (props) => {
  const { t } = useTranslation();
  const { zipFileName, targetDir, setOto } = useOtoProjectStore();
  const storagedOto_: string | null = localStorage.getItem("oto");
  const [storagedOto, setStoragedOto] = React.useState<{}>({});
  const [selectHistory, setSelectHistory] = React.useState<string>(null);
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOtoTemp] = React.useState<Oto | null>(null);

  React.useEffect(() => {
    const storagedOto__ = storagedOto_ === null ? {} : JSON.parse(storagedOto_);
    LOG.debug(`localstorageから編集履歴読込`, "TargetDirDialogTabPanelStoraged");
    setStoragedOto(storagedOto__);
  }, []);

  React.useEffect(() => {
    const i = Object.keys(storagedOto).indexOf(zipFileName);
    if (i >= 0) {
      const f = Object.keys(storagedOto)[i];
      const j = Object.keys(storagedOto[f]).indexOf(targetDir);
      if (j >= 0) {
        LOG.debug(
          `当該フォルダの編集履歴が見つかりました`,
          "TargetDirDialogTabPanelStoraged"
        );
        setSelectHistory("t_" + i + "_" + j);
      }
    }
  }, [storagedOto, targetDir]);

  React.useEffect(() => {
    if (selectHistory === undefined || selectHistory === null) return;
    const [tmp, i, j, _] = selectHistory.split("_");
    const f = Object.keys(storagedOto)[parseInt(i)];
    const d = Object.keys(storagedOto[f])[parseInt(j)];
    const oto_ = new Oto();
    oto_
      .InputOtoAsync(
        targetDir,
        new Blob([storagedOto[f][d]["oto"]], { type: "text/plain" }),
        "UTF-8"
      )
      .then(() => {
        LOG.debug(
          `oto.ini読込完了。ファイル名${f}、フォルダ名:${d}`,
          "TargetDirDialogTabPanelStoraged"
        );
        setOtoTemp(oto_);
      });
  }, [selectHistory]);
  const OnSelectChange = (e: SelectChangeEvent) => {
    LOG.debug(
      `読込履歴変更:${e.target.value}`,
      "TargetDirDialogTabPanelStoraged"
    );
    setSelectHistory(e.target.value);
  };

  /**
   * 現在読み込んでいるoto.iniを親コンポーネントに返し、ダイアログを閉じる。
   */
  const OnSubmitClick = () => {
    LOG.debug(`oto.ini確定`, "TargetDirDialogTabPanelStoraged");
    Log.gtag("loadStoragedOto");
    setOto(oto);
    props.setDialogOpen(false);
  };
  return (
    <TabPanel value="2" sx={{ p: 0 }}>
      {storagedOto_ === null ? (
        <>
          <Typography>{t("targetDirDialog.nothingHistory")}</Typography>
        </>
      ) : (
        <>
          <FullWidthButton onClick={OnSubmitClick} disabled={oto === null}>
            {t("targetDirDialog.submit")}
          </FullWidthButton>
          <br />
          <FullWidthSelect
            label={t("targetDirDialog.readHistory")}
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
          </FullWidthSelect>
          {oto !== null && (
            <>
              <Divider />
              <TargetDirDialogCheckList oto={oto} />
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
}
