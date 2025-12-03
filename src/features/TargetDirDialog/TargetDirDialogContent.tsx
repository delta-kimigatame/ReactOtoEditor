import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

import { TargetDirDialogSelectDir } from "../../components/TargetDirDialog/TargetDirDialogSelectDir";
import { TargetDirDialogTabPanelZip } from "../../components/TargetDirDialog/TargetDirDialogTabPanelZip";
import { TargetDirDialogTabPanelStoraged } from "./TargetDirDialogTabPanelStoraged";
import { TargetDirDialogTabPanelTemplate } from "./TargetDirDialogTabPanelTemplate";

import { LOG } from "../../lib/Logging";
import { TargetDirDialogTabMakePanel } from "./TargetDirDialogTabMakePanel";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ
 * @param props {@link TargetDirDialogContentProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ
 */
export const TargetDirDialogContent: React.FC<TargetDirDialogContentProps> = (
  props
) => {
  const { t } = useTranslation();
  const { readZip, targetDir } = useOtoProjectStore();
  /** oto.iniがディレクトリ内に存在するか否か */
  const [nothingOto, setNothingOto] = React.useState<boolean>(false);
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOtoTemp] = React.useState<Oto | null>(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");
  /** tabの表示を切り替える */
  const [tabIndex, setTabIndex] = React.useState<string>("1");

  /** `targetDir`が変更されたとき、oto.iniの読込を行う。 */
  React.useEffect(() => {
    if (targetDir === null) return;
    if (readZip === null) return;
    setNothingOto(false);
    LOG.debug(`targetDirの変更。${targetDir}`, "TargetDirDialogContent");
    LoadOto();
  }, [targetDir]);

  /**
   * oto.iniを読み込む。
   * @param encoding_ 文字コード
   */
  const LoadOto = (encoding_: string = "SJIS") => {
    const otoPath = targetDir === "" ? "oto.ini" : targetDir + "/oto.ini";
    if (Object.keys(readZip).includes(otoPath)) {
      LOG.debug(
        `${otoPath}読込。文字コード:${encoding_}`,
        "TargetDirDialogContent"
      );
      readZip[otoPath].async("arraybuffer").then((result) => {
        const oto = new Oto();
        oto
          .InputOtoAsync(
            targetDir,
            new Blob([result], { type: "text/plain" }),
            encoding_
          )
          .then(() => {
            LOG.debug(`${otoPath}読込完了`, "TargetDirDialogContent");
            setOtoTemp(oto);
            setTabIndex("1");
          });
      });
    } else {
      LOG.debug(
        `${targetDir}内にoto.iniが見つかりませんでした。`,
        "TargetDirDialogContent"
      );
      setNothingOto(true);
      setTabIndex("2");
    }
  };

  const OnTabChange = (e: React.SyntheticEvent, newValue: string) => {
    LOG.debug(`tabpanel変更。${newValue}`, "TargetDirDialogContent");
    setTabIndex(newValue);
  };
  return (
    <>
      <DialogContent>
        <TargetDirDialogSelectDir
        />
        <Divider />
        <Box sx={{ p: 1 }}>
          {targetDir !== null && (
            <>
              <TabContext value={tabIndex}>
                <TabList
                  onChange={OnTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab value="1" label={t("targetDirDialog.tab.zip")} />
                  <Tab value="2" label={t("targetDirDialog.tab.storaged")} />
                  <Tab value="3" label={t("targetDirDialog.tab.template")} />
                  <Tab value="4" label={t("targetDirDialog.tab.make")} />
                </TabList>
                <TargetDirDialogTabPanelZip
                  oto={oto}
                  setOtoTemp={setOtoTemp}
                  setDialogOpen={props.setDialogOpen}
                  LoadOto={LoadOto}
                  nothingOto={nothingOto}
                />
                <TargetDirDialogTabPanelStoraged
                  setDialogOpen={props.setDialogOpen}
                />
                <TargetDirDialogTabPanelTemplate
                  setDialogOpen={props.setDialogOpen}
                />
                <TargetDirDialogTabMakePanel
                  setDialogOpen={props.setDialogOpen}
                />
              </TabContext>
            </>
          )}
        </Box>
      </DialogContent>
    </>
  );
};

export interface TargetDirDialogContentProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
