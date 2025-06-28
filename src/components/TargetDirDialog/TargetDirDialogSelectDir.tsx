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
  const {targetDirs,targetDir,setTargetDir}=useOtoProjectStore()

  const OnSelectChange = (e: SelectChangeEvent) => {
    setTargetDir(e.target.value);
  };
  return (
    <>
      <Box sx={{ p: 1 }}>
        <FullWidthSelect
          label={t("targetDirDialog.targetDir")}
          value={targetDir}
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
}
