import * as React from "react";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export const TargetDirDialogSelectDir: React.FC<Props> = (props) => {
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

type Props = {
  targetDirs: Array<string> | null;
  targetDir: string | null;
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
};
