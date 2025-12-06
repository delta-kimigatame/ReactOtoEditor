import * as React from "react";
import { useTranslation } from "react-i18next";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";

import { FullWidthTextField } from "../Common/FullWidthTextField";
import { CommonCheckBox } from "../Common/CommonCheckBox";
import { MakePanelVowelAccordion } from "../../features/TargetDirDialog/MakePanel/MakePanelVowelAccordion";
import { MakePanelConsonantAccordion } from "../../features/TargetDirDialog/MakePanel/MakePanelConsonantAccordion";
import { MakePanelReplaceAccordion } from "../../features/TargetDirDialog/MakePanel/MakePanelReplaceAccordion";

/**
 * 複数エイリアス生成の詳細設定Accordion
 */
export const MakePanelSettingsAccordion: React.FC<MakePanelSettingsAccordionProps> = ({
  tempo,
  setTempo,
  offset,
  setOffset,
  maxnum,
  setMaxnum,
  underbar,
  setUnderbar,
  beginingCv,
  setBeginingCv,
  requireHead,
  setRequireHead,
  requireVCV,
  setRequireVCV,
  requireOnlyConsonant,
  setRequireOnlyConsonant,
  vowel,
  setVowel,
  consonant,
  setConsonant,
  replace,
  setReplace,
}) => {
  const { t } = useTranslation();

  return (
    <Accordion sx={{ m: 1 }} data-testid="settings-accordion">
      <AccordionSummary expandIcon={<ExpandMoreIcon />} data-testid="settings-accordion-summary">
        <InputLabel>
          {t("targetDirDialog.makePanel.iniDetail")}
        </InputLabel>
      </AccordionSummary>
      <AccordionDetails>
        <FullWidthTextField
          type="number"
          label={t("targetDirDialog.makePanel.settings.tempo")}
          value={tempo}
          onChange={(e) => {
            setTempo(e.target.value);
          }}
          data-testid="tempo-input"
        />
        <FullWidthTextField
          type="number"
          label={t("targetDirDialog.makePanel.settings.offset")}
          value={offset}
          onChange={(e) => {
            setOffset(e.target.value);
          }}
          data-testid="offset-input"
        />
        <FullWidthTextField
          type="number"
          label={t("targetDirDialog.makePanel.settings.maxnum")}
          value={maxnum}
          onChange={(e) => {
            setMaxnum(e.target.value);
          }}
          data-testid="maxnum-input"
        />
        <CommonCheckBox
          checked={underbar}
          setChecked={setUnderbar}
          label={t("targetDirDialog.makePanel.settings.underbar")}
          data-testid="underbar-checkbox"
        />
        <br />
        <CommonCheckBox
          checked={beginingCv}
          setChecked={setBeginingCv}
          label={t("targetDirDialog.makePanel.settings.beginingCv")}
          data-testid="begining-cv-checkbox"
        />
        <br />
        <CommonCheckBox
          checked={requireHead}
          setChecked={setRequireHead}
          label={t("targetDirDialog.makePanel.settings.Head")}
          data-testid="require-head-checkbox"
        />
        <br />
        <CommonCheckBox
          checked={requireVCV}
          setChecked={setRequireVCV}
          label={t("targetDirDialog.makePanel.settings.VCV")}
          data-testid="require-vcv-checkbox"
        />
        <br />
        <CommonCheckBox
          checked={requireOnlyConsonant}
          setChecked={setRequireOnlyConsonant}
          label={t("targetDirDialog.makePanel.settings.onlyConsonant")}
          data-testid="require-only-consonant-checkbox"
        />
        <br />
        <MakePanelVowelAccordion vowel={vowel} setVowel={setVowel} />
        <MakePanelConsonantAccordion
          consonant={consonant}
          setConsonant={setConsonant}
        />
        <MakePanelReplaceAccordion
          replace={replace}
          setReplace={setReplace}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export interface MakePanelSettingsAccordionProps {
  /** テンポ */
  tempo: number;
  /** テンポ設定関数 */
  setTempo: (value: number) => void;
  /** オフセット */
  offset: number;
  /** オフセット設定関数 */
  setOffset: (value: number) => void;
  /** 最大エイリアス数 */
  maxnum: number;
  /** 最大エイリアス数設定関数 */
  setMaxnum: (value: number) => void;
  /** アンダーバー使用 */
  underbar: boolean;
  /** アンダーバー使用設定関数 */
  setUnderbar: (value: boolean) => void;
  /** 先頭CV */
  beginingCv: boolean;
  /** 先頭CV設定関数 */
  setBeginingCv: (value: boolean) => void;
  /** 語頭音必須 */
  requireHead: boolean;
  /** 語頭音必須設定関数 */
  setRequireHead: (value: boolean) => void;
  /** VCV必須 */
  requireVCV: boolean;
  /** VCV必須設定関数 */
  setRequireVCV: (value: boolean) => void;
  /** 子音のみ必須 */
  requireOnlyConsonant: boolean;
  /** 子音のみ必須設定関数 */
  setRequireOnlyConsonant: (value: boolean) => void;
  /** 母音設定 */
  vowel: Array<{ vowel: string; variant: string }>;
  /** 母音設定関数 */
  setVowel: (value: Array<{ vowel: string; variant: string }>) => void;
  /** 子音設定 */
  consonant: Array<{ consonant: string; variant: string; length: number }>;
  /** 子音設定関数 */
  setConsonant: (value: Array<{ consonant: string; variant: string; length: number }>) => void;
  /** 置換設定 */
  replace: Array<[before: string, after: string]>;
  /** 置換設定関数 */
  setReplace: (value: Array<[before: string, after: string]>) => void;
}
