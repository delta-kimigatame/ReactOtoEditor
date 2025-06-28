import * as React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";

import { FullWidthSelect } from "../Common/FullWidthSelect";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ内の対象ディレクトリを選ぶ部分
 * @param props {@link TargetDirDialogSelectDirProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ内の対象ディレクトリを選ぶ部分
 */
export const TargetDirDialogSelectDir: React.FC<
  TargetDirDialogSelectDirProps
> = (props) => {
  const { t } = useTranslation();
  const {targetDirs}=useOtoProjectStore()

  const OnSelectChange = (e: SelectChangeEvent) => {
    props.setTargetDir(e.target.value);
  };
  return (
    <>
      <Box sx={{ p: 1 }}>
        <FullWidthSelect
          label={t("targetDirDialog.targetDir")}
          value={props.targetDir}
          onChange={OnSelectChange}
        >
          {targetDirs.map((d) => (
            <MenuItem value={d}>{d === "" ? "/" : d}</MenuItem>
          ))}
        </FullWidthSelect>
      </Box>
    </>
  );
};

export interface TargetDirDialogSelectDirProps {
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
}
