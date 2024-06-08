import * as React from "react";
import JSZip from "jszip";

import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export const LoadZipButtonArea: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const OnSubmitClick = () => {
    if (props.zipFiles === null) return;
    props.setZipFiles(props.zipFiles);
    props.setDialogOpen(false);
  };

  const OnSelectChange = (e: SelectChangeEvent) => {
    props.setEncoding(e.target.value);
    props.setProcessing(true);
    props.setZipFiles(null);
    props.LoadZip(props.file, e.target.value);
  };

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        sx={{ m: 1 }}
        onClick={OnSubmitClick}
        size="large"
        color="inherit"
      >
        {t("loadZipDialog.submit")}
      </Button>
      <br />
      <FormControl fullWidth sx={{ m: 1 }}>
        <InputLabel>{t("loadZipDialog.encoding")}</InputLabel>
        <Select
          label={"encoding"}
          variant="filled"
          color="primary"
          value={props.encoding}
          onChange={OnSelectChange}
        >
          <MenuItem value={"utf-8"}>UTF-8</MenuItem>
          <MenuItem value={"Shift-Jis"}>Shift-JIS</MenuItem>
        </Select>
      </FormControl>
      <Divider />
    </>
  );
};

type Props = {
  file: File | null;
  encoding: string;
  zipFiles: {
    [key: string]: JSZip.JSZipObject;
  } | null;
  LoadZip:(file: File, encoding?: string) => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setEncoding: React.Dispatch<React.SetStateAction<string>>;
  setZipFiles: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
};
