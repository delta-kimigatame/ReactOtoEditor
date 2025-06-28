import * as React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

import { Log } from "../../lib/Logging";
import { FullWidthButton } from "../../Common/FullWidthButton";

/**
 * oto.iniを生成する場合のパネル。母音設定アコーディオン
 * @param props {@link MakePanelVowelAccordionProps}
 * @returns oto.iniを生成する場合のパネル。母音設定アコーディオン
 */
export const MakePanelVowelAccordion: React.FC<
  MakePanelVowelAccordionProps
> = (props) => {
  const { t } = useTranslation();
  const OnVowelChange = (e, index: number, target: "symbol" | "variant") => {
    const vowels_ = props.vowel.slice();
    if (target === "symbol") {
      vowels_[index] = { vowel: e.target.value, variant: props.vowel[index].variant };
    } else {
      vowels_[index] = { vowel: props.vowel[index].vowel, variant: e.target.value };
    }
    props.setVowel(vowels_);
  };

  const OnVowelAdd = () => {
    const vowels_ = props.vowel.slice();
    vowels_.push({ vowel: "", variant: "" });
    props.setVowel(vowels_);
    Log.log("vowelを追加しました","MakePanelVowelAccordion")
  };
  return (
    <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <InputLabel>
        {t("targetDirDialog.makePanel.settings.vowel")}
      </InputLabel>
    </AccordionSummary>
    <AccordionDetails>
      {props.vowel.map((v, i) => (
        <Box sx={{ display: "flex" }}>
          <TextField
            variant="outlined"
            sx={{
              m: 1,
            }}
            type="text"
            label={t(
              "targetDirDialog.makePanel.settings.vowelSymbol"
            )}
            value={v.vowel}
            onChange={(e) => {
              OnVowelChange(e, i, "symbol");
            }}
          />
          <TextField
            variant="outlined"
            sx={{
              m: 1,
              flexGrow: 1,
            }}
            type="text"
            label={t(
              "targetDirDialog.makePanel.settings.vowelVariant"
            )}
            value={v.variant}
            onChange={(e) => {
              OnVowelChange(e, i, "variant");
            }}
          />
        </Box>
      ))}
      <FullWidthButton onClick={OnVowelAdd}>
        {t("targetDirDialog.makePanel.settings.add")}
      </FullWidthButton>
    </AccordionDetails>
  </Accordion>
  );
};

export interface MakePanelVowelAccordionProps {
  /** 母音の設定値の更新 */
  setVowel: React.Dispatch<
    React.SetStateAction<
    Array<{ vowel: string; variant: string }>
    >
  >;
  /** 母音の設定値 */
  vowel: Array<{ vowel: string; variant: string }>;
}
