import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { FullWidthSelect } from "../../components/Common/FullWidthSelect";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTranslation } from "react-i18next";

export const TargetParamSelect: React.FC<TargetParamSelectProps> = ({
  label,
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  return (
    <FullWidthSelect
      label={label}
      value={value}
      onChange={onChange}
      data-testid="table-dialog-target-select"
    >
      <MenuItem value={"offset"}>{t("oto.offset")}</MenuItem>
      <MenuItem value={"overlap"}>{t("oto.overlap")}</MenuItem>
      <MenuItem value={"preutter"}>{t("oto.preutter")}</MenuItem>
      <MenuItem value={"velocity"}>{t("oto.velocity")}</MenuItem>
      <MenuItem value={"blank"}>{t("oto.blank")}</MenuItem>
    </FullWidthSelect>
  );
};

export interface TargetParamSelectProps {
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent) => void;
}
