import * as React from "react";
import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { FullWidthSelect } from "../../../components/Common/FullWidthSelect";

import { LOG } from "../../../lib/Logging";
import { MakeOtoTempIni } from "../../../lib/MakeOtoTemp/Interface";
import { MakeJpCv, MakeJpCVVC, MakeJpVCV } from "../../../lib/MakeOtoTemp/Preset";
import { InputFile } from "../../../lib/MakeOtoTemp/Input";

/**
 * oto.iniを生成する場合のパネル。プリセット選択部分
 * @param props {@link MakePanelSelectPresetProps}
 * @returns oto.iniを生成する場合のパネル。プリセット選択部分
 */
export const MakePanelSelectPreset: React.FC<
MakePanelSelectPresetProps
> = (props) => {
  const { t } = useTranslation();
  /** ini読込方法 */
  const [loadIni, setLoadIni] = React.useState<"CV" | "VCV" | "CVVC" | "load">(
    null
  );


  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);


  /** プリセット選択セレクトボックスのイベント */
  const OnLoadIniChange = (e: SelectChangeEvent) => {
    setLoadIni(e.target.value as "CV" | "VCV" | "CVVC" | "load");
    if (e.target.value === "CV") {
      props.setIni(MakeJpCv());
    } else if (e.target.value === "VCV") {
      props.setIni(MakeJpVCV());
    } else if (e.target.value === "CVVC") {
      props.setIni(MakeJpCVVC());
    } else {
      inputRef.current.click();
    }
  };

  /** 隠し要素クリック時のイベント */
  const OnFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    LOG.debug(
      `ファイル読み込み。${e.target.files[0].name}`,
      "TargetDirDialogTabMakePanel"
    );
    const ini_ = await InputFile(e.target.files[0]);
    props.setIni(ini_);
  };

  return (
    <>
      <input
        type="file"
        onChange={OnFileChange}
        hidden
        ref={inputRef}
        accept=".ini"
        data-testid="make-panel-select-preset-file-input"
      ></input>
      <FullWidthSelect
        label={t("targetDirDialog.makePanel.loadini")}
        value={loadIni}
        onChange={OnLoadIniChange}
      >
        <MenuItem value={"CV"}>
          {t("targetDirDialog.makePanel.CVPreset")}
        </MenuItem>
        <MenuItem value={"VCV"}>
          {t("targetDirDialog.makePanel.VCVPreset")}
        </MenuItem>
        <MenuItem value={"CVVC"}>
          {t("targetDirDialog.makePanel.CVVCPreset")}
        </MenuItem>
        <Divider />
        <MenuItem value={"load"}>
          {t("targetDirDialog.makePanel.load")}
        </MenuItem>
      </FullWidthSelect>
    </>
  );
};

export interface MakePanelSelectPresetProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setIni: (MakeOtoTempIni) => void;
}
