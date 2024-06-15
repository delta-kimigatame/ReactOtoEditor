import * as React from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ内の対象ディレクトリを選ぶ部分
 * @param props {@link TargetDirDialogSelectDirProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ内の対象ディレクトリを選ぶ部分
 */
export const TargetDirDialogSelectDir: React.FC<TargetDirDialogSelectDirProps> = (props) => {
  const { t } = useTranslation();

  const OnSelectChange = (e: SelectChangeEvent) => {
    props.setTargetDir(e.target.value);
  };
  return (
    <>
        <Box sx={{ p: 1 }}>
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel>{t("targetDirDialog.targetDir")}</InputLabel>
            <Select
              label={"targetDir"}
              variant="filled"
              value={props.targetDir}
              onChange={OnSelectChange}
            >
              {props.targetDirs.map((d) => (
                <MenuItem value={d}>{d === "" ? "/" : d}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
    </>
  );
};

export interface TargetDirDialogSelectDirProps {
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
};
