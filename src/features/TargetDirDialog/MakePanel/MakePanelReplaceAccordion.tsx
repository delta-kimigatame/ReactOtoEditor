import * as React from "react";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

import { LOG } from "../../../lib/Logging";
import { FullWidthButton } from "../../../components/Common/FullWidthButton";

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
    LOG.debug("replaceを追加しました","MakePanelReplaceAccordion")
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
          <Box key={i} sx={{ display: "flex" }}>
            <TextField
              variant="outlined"
              sx={{
                m: 1,
                flexGrow: 1,
              }}
              type="text"
              label={t("targetDirDialog.makePanel.settings.replaceFilename")}
              value={r[0]}
              data-testid={`replace-before-input-${i}`}
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
              data-testid={`replace-after-input-${i}`}
              onChange={(e) => {
                OnReplaceChange(e, i, 1);
              }}
            />
          </Box>
        ))}
        <FullWidthButton onClick={OnReplaceAdd} data-testid="replace-add-button">
          {t("targetDirDialog.makePanel.settings.add")}
        </FullWidthButton>
      </AccordionDetails>
    </Accordion>
  );
};

export interface MakePanelReplaceAccordionProps {
  /** 置換の設定値の更新 */
  setReplace: (replaces: Array<[before: string, after: string]>) => void;
  /** 置換の設定値 */
  replace: Array<[before: string, after: string]>;
}
