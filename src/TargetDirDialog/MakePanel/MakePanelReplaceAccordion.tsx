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
 * oto.iniを生成する場合のパネル。置換設定アコーディオン
 * @param props {@link MakePanelReplaceAccordionProps}
 * @returns oto.iniを生成する場合のパネル。置換設定アコーディオン
 */
export const MakePanelReplaceAccordion: React.FC<
  MakePanelReplaceAccordionProps
> = (props) => {
  const { t } = useTranslation();
  const OnReplaceChange = (e, index: number, index2: number) => {
    const replace_ = props.replace.slice();
    replace_[index][index2] = e.target.value;
    props.setReplace(replace_);
  };
  const OnReplaceAdd = () => {
    const replace_ = props.replace.slice();
    replace_.push(["", ""]);
    props.setReplace(replace_);
    Log.log("replaceを追加しました","MakePanelReplaceAccordion")
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <InputLabel>
          {t("targetDirDialog.makePanel.settings.replace")}
        </InputLabel>
      </AccordionSummary>
      <AccordionDetails>
        {props.replace.map((r, i) => (
          <Box sx={{ display: "flex" }}>
            <TextField
              variant="outlined"
              sx={{
                m: 1,
                flexGrow: 1,
              }}
              type="text"
              label={t("targetDirDialog.makePanel.settings.replaceFilename")}
              value={r[0]}
              onChange={(e) => {
                OnReplaceChange(e, i, 0);
              }}
            />
            <TextField
              variant="outlined"
              sx={{
                m: 1,
                flexGrow: 1,
              }}
              type="text"
              label={t("targetDirDialog.makePanel.settings.replaceAlias")}
              value={r[1]}
              onChange={(e) => {
                OnReplaceChange(e, i, 1);
              }}
            />
          </Box>
        ))}
        <FullWidthButton onClick={OnReplaceAdd}>
          {t("targetDirDialog.makePanel.settings.add")}
        </FullWidthButton>
      </AccordionDetails>
    </Accordion>
  );
};

export interface MakePanelReplaceAccordionProps {
  /** 置換の設定値の更新 */
  setReplace: React.Dispatch<
    React.SetStateAction<Array<[before: string, after: string]>>
  >;
  /** 置換の設定値 */
  replace: Array<[before: string, after: string]>;
}
