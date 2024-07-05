import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

/**
 * oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面のエイリアスの種類選択部分
 * @param props {@link TargetDirDialogAliasVariantProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面のエイリアスの種類選択部分
 */
export const TargetDirDialogAliasVariant: React.FC<
  TargetDirDialogAliasVariantProps
> = (props) => {
  const { t } = useTranslation();
  const OnAliasVariantChange = (e: SelectChangeEvent, i: number) => {
    const av = props.aliasVariant.slice();
    av[i] = e.target.value as "CV" | "VCV" | "VC";
    props.setAliasVariant(av);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InputLabel>{t("targetDirDialog.CorrectType")}</InputLabel>
        </AccordionSummary>
        <AccordionDetails>
          {props.oto.GetLines()[props.targetDir].map((l, i) => (
            <>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel>{l.split("=")[1].split(",")[0]}</InputLabel>
                <Select
                  label={l.split("=")[1].split(",")[0]}
                  variant="filled"
                  color="primary"
                  value={props.aliasVariant[i]}
                  onChange={(e) => {
                    OnAliasVariantChange(e, i);
                  }}
                >
                  <MenuItem value="CV">{t("targetDirDialog.CV")}</MenuItem>
                  <MenuItem value="VCV">{t("targetDirDialog.VCV")}</MenuItem>
                  <MenuItem value="VC">{t("targetDirDialog.VC")}</MenuItem>
                </Select>
              </FormControl>
            </>
          ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export interface TargetDirDialogAliasVariantProps {
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** エイリアスの種類 */
  aliasVariant: Array<"CV" | "VCV" | "VC"> | null;
  /** エイリアスの種類を設定する。 */
  setAliasVariant: React.Dispatch<React.SetStateAction<Array<"CV" | "VCV" | "VC"> | null>>;
}
