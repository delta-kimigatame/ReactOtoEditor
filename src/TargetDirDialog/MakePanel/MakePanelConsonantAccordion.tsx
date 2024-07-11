import * as React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

import { Log } from "../../Lib/Logging";
import { FullWidthButton } from "../../Common/FullWidthButton";

/**
 * oto.iniを生成する場合のパネル。子音設定アコーディオン
 * @param props {@link MakePanelConsonantAccordionProps}
 * @returns oto.iniを生成する場合のパネル。子音設定アコーディオン
 */
export const MakePanelConsonantAccordion: React.FC<
  MakePanelConsonantAccordionProps
> = (props) => {
  const { t } = useTranslation();
  const OnConsonantChange = (
    e,
    index: number,
    target: "symbol" | "variant" | "length"
  ) => {
    const consonant_ = props.consonant.slice();
    if (target === "symbol") {
      consonant_[index] = {
        consonant: e.target.value,
        variant: props.consonant[index].variant,
        length: props.consonant[index].length,
      };
    } else if (target === "variant") {
      consonant_[index] = {
        consonant: props.consonant[index].consonant,
        variant: e.target.value,
        length: props.consonant[index].length,
      };
    } else {
      consonant_[index] = {
        consonant: props.consonant[index].consonant,
        variant: props.consonant[index].variant,
        length: e.target.value,
      };
    }
    props.setConsonant(consonant_);
  };
  const OnConsonantAdd = () => {
    const consonant_ = props.consonant.slice();
    consonant_.push({ consonant: "", variant: "", length: 0 });
    props.setConsonant(consonant_);
    Log.log("consonantを追加しました","MakePanelConsonantAccordion")
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <InputLabel>
          {t("targetDirDialog.makePanel.settings.consonant")}
        </InputLabel>
      </AccordionSummary>
      <AccordionDetails>
        {props.consonant.map((c, i) => (
          <Box sx={{ display: "flex" }}>
            <TextField
              variant="outlined"
              sx={{
                m: 1,
              }}
              type="text"
              label={t("targetDirDialog.makePanel.settings.consonantSymbol")}
              value={c.consonant}
              onChange={(e) => {
                OnConsonantChange(e, i, "symbol");
              }}
            />
            <TextField
              variant="outlined"
              sx={{
                m: 1,
                flexGrow: 1,
              }}
              type="text"
              label={t("targetDirDialog.makePanel.settings.consonantVariant")}
              value={c.variant}
              onChange={(e) => {
                OnConsonantChange(e, i, "variant");
              }}
            />
            <TextField
              variant="outlined"
              sx={{
                m: 1,
              }}
              type="number"
              label={t("targetDirDialog.makePanel.settings.consonantLength")}
              value={c.length}
              onChange={(e) => {
                OnConsonantChange(e, i, "length");
              }}
            />
          </Box>
        ))}
        <FullWidthButton onClick={OnConsonantAdd}>
          {t("targetDirDialog.makePanel.settings.add")}
        </FullWidthButton>
      </AccordionDetails>
    </Accordion>
  );
};

export interface MakePanelConsonantAccordionProps {
  /** 子音の設定値の更新 */
  setConsonant: React.Dispatch<
    React.SetStateAction<
      Array<{ consonant: string; variant: string; length: number }>
    >
  >;
  /** 子音の設定値 */
  consonant: Array<{ consonant: string; variant: string; length: number }>;
}
