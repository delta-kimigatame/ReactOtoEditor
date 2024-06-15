import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export const TargetDirDialogButtonArea: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const OnSelectChange = (e: SelectChangeEvent) => {
    props.setEncoding(e.target.value);
    props.setOtoTemp(null);
    props.LoadOto(e.target.value);
  };

  const OnSubmitClick = () => {
    props.setOto(props.oto);
    props.setDialogOpen(false);
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
        {t("targetDirDialog.submit")}
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
          <MenuItem value={"UTF8"}>UTF-8</MenuItem>
          <MenuItem value={"SJIS"}>Shift-JIS</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

type Props = {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  oto: Oto;
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  setOtoTemp: React.Dispatch<React.SetStateAction<Oto | null>>;
  LoadOto: (encoding_?: string) => void;
  encoding:string;
  setEncoding:React.Dispatch<React.SetStateAction<string>>
};
