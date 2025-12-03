import * as React from "react";
import { Oto } from "utauoto";
import JSZip from "jszip";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TabPanel from "@mui/lab/TabPanel";
import MenuItem from "@mui/material/MenuItem";
import { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InputLabel from "@mui/material/InputLabel";

import { FullWidthSelect } from "../../components/Common/FullWidthSelect";
import { FullWidthTextField } from "../../components/Common/FullWidthTextField";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { CommonCheckBox } from "../../components/Common/CommonCheckBox";
import { MakePanelReplaceAccordion } from "./MakePanel/MakePanelReplaceAccordion";
import { MakePanelConsonantAccordion } from "./MakePanel/MakePanelConsonantAccordion";
import { MakePanelVowelAccordion } from "./MakePanel/MakePanelVowelAccordion";
import { MakePanelSelectPreset } from "./MakePanel/MakePanelSelectPreset";

import { LOG } from "../../lib/Logging";
import { MakeOtoTempIni } from "../../lib/MakeOtoTemp/Interface";
import { MakeOto, MakeOtoSingle } from "../../lib/MakeOtoTemp/MakeOto";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * oto.iniを生成する場合のパネル
 * @param props {@link TargetDirDialogTabPanelTemplateProps}
 * @returns oto.iniを生成する場合のパネル
 */
export const TargetDirDialogTabMakePanel: React.FC<
  TargetDirDialogTabMakePanelProps
> = (props) => {
  const { t } = useTranslation();
  const { readZip, targetDir, setOto } = useOtoProjectStore();
  /** 生成方法 */
  const [mode, setMode] = React.useState<"single" | "multi">(null);
  const [ini, setIni] = React.useState<MakeOtoTempIni>(null);
  /** iniの各パラメータ */
  const [offset, setOffset] = React.useState<number>(1000);
  const [tempo, setTempo] = React.useState<number>(120);
  const [maxnum, setMaxnum] = React.useState<number>(2);
  const [underbar, setUnderbar] = React.useState<boolean>(false);
  const [beginingCv, setBeginingCv] = React.useState<boolean>(false);
  const [requireHead, setRequireHead] = React.useState<boolean>(false);
  const [requireVCV, setRequireVCV] = React.useState<boolean>(false);
  const [requireOnlyConsonant, setRequireOnlyConsonant] =
    React.useState<boolean>(false);
  const [vowel, setVowel] = React.useState<
    Array<{ vowel: string; variant: string }>
  >([]);
  const [consonant, setConsonant] = React.useState<
    Array<{ consonant: string; variant: string; length: number }>
  >([]);
  const [replace, setReplace] = React.useState<
    Array<[before: string, after: string]>
  >([]);

  /** wav解析の有無 */
  const [analyze, setAnalyze] = React.useState<boolean>(false);
  /** wavファイル頭の連番を無視するか否か */
  const [skipBeginingNumber, setSkipBeginingNumber] =
    React.useState<boolean>(false);

  /** モード選択セレクトボックスのイベント */
  const OnModeChange = (e: SelectChangeEvent) => {
    setMode(e.target.value as "single" | "multi");
  };

  React.useEffect(() => {
    if (ini === null) return;
    updateStateFromIni(ini, {
      setOffset,
      setTempo,
      setMaxnum,
      setUnderbar,
      setBeginingCv,
      setRequireHead,
      setRequireVCV,
      setRequireOnlyConsonant,
      setVowel,
      setConsonant,
      setReplace,
    });
  }, [ini]);

  const OnMakeClick = () => {
    LOG.debug(`oto.iniを生成します。mode:${mode}`, "TargetDirDialogTabMakePanel");
    if (mode === "single") {
      const oto = MakeOtoSingle(
        readZip,
        targetDir,
        skipBeginingNumber,
        analyze
      );
      LOG.gtag("makeSingleOto");
      LOG.debug(`oto.iniを生成しました。`, "TargetDirDialogTabMakePanel");
      setOto(oto);
    } else {
      // iniがnullの場合はデフォルト値を使用
      const baseIni = ini || {
        offset: 1000,
        tempo: 120,
        max: 2,
        underbar: false,
        beginingCv: false,
        noHead: false,
        noVCV: false,
        onlyConsonant: false,
        vowel: {},
        consonant: {},
        replace: [] as Array<[string, string]>,
      };
      
      const updatedIni = buildIniFromState(baseIni, {
        tempo,
        offset,
        maxnum,
        underbar,
        beginingCv,
        requireHead,
        requireVCV,
        requireOnlyConsonant,
        vowel,
        consonant,
        replace
      });
      LOG.debug(`ini:${JSON.stringify(updatedIni)}`, "TargetDirDialogTabMakePanel");
      const oto = MakeOto(
        updatedIni,
        Object.keys(readZip),
        targetDir,
        skipBeginingNumber
      );
      LOG.gtag("makeOto");
      LOG.debug(`oto.iniを生成しました。`, "TargetDirDialogTabMakePanel");
      setOto(oto);
    }
  };

  return (
    <TabPanel value="4" sx={{ p: 0 }}>
      <Box sx={{ p: 1 }}>
        <FullWidthSelect
          label={t("targetDirDialog.makePanel.title")}
          value={mode}
          onChange={OnModeChange}
          data-testid="mode-select"
        >
          <MenuItem value={"single"} data-testid="mode-single">
            {t("targetDirDialog.makePanel.single")}
          </MenuItem>
          <MenuItem value={"multi"} data-testid="mode-multi">
            {t("targetDirDialog.makePanel.multi")}
          </MenuItem>
        </FullWidthSelect>
      </Box>
      <Divider />
      {mode === "multi" && (
        <Box sx={{ p: 1 }}>
          <MakePanelSelectPreset setIni={setIni} />
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
        </Box>
      )}
      {mode === "single" && (
        <>
          <CommonCheckBox
            checked={analyze}
            setChecked={setAnalyze}
            label={t("targetDirDialog.makePanel.analyze")}
            data-testid="analyze-checkbox"
          />
          <br />
        </>
      )}
      <CommonCheckBox
        disabled={mode === null}
        checked={skipBeginingNumber}
        setChecked={setSkipBeginingNumber}
        label={t("targetDirDialog.makePanel.settings.skipBeginingNumber")}
        data-testid="skip-begining-number-checkbox"
      />
      <br />
      <FullWidthButton onClick={OnMakeClick} disabled={mode === null} data-testid="make-button">
        {t("targetDirDialog.makePanel.make")}
      </FullWidthButton>
    </TabPanel>
  );
};

export interface TargetDirDialogTabMakePanelProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: (open: boolean) => void;
}

/**
 * MakeOtoTempIniからStateを更新する
 */
export const updateStateFromIni = (
  ini: MakeOtoTempIni,
  setters: {
    setOffset: (value: number) => void;
    setTempo: (value: number) => void;
    setMaxnum: (value: number) => void;
    setUnderbar: (value: boolean) => void;
    setBeginingCv: (value: boolean) => void;
    setRequireHead: (value: boolean) => void;
    setRequireVCV: (value: boolean) => void;
    setRequireOnlyConsonant: (value: boolean) => void;
    setVowel: (value: Array<{ vowel: string; variant: string }>) => void;
    setConsonant: (value: Array<{ consonant: string; variant: string; length: number }>) => void;
    setReplace: (value: Array<[before: string, after: string]>) => void;
  }
) => {
  setters.setOffset(ini.offset);
  setters.setTempo(ini.tempo);
  setters.setMaxnum(ini.max);
  setters.setUnderbar(ini.underbar);
  setters.setBeginingCv(ini.beginingCv);
  setters.setRequireHead(!ini.noHead);
  setters.setRequireVCV(!ini.noVCV);
  setters.setRequireOnlyConsonant(ini.onlyConsonant);
  
  setters.setVowel(convertVowelsFromIni(ini.vowel));
  setters.setConsonant(convertConsonantsFromIni(ini.consonant));
  setters.setReplace(ini.replace);
};

/**
 * StateからMakeOtoTempIniを構築する
 */
export const buildIniFromState = (
  baseIni: MakeOtoTempIni,
  state: {
    tempo: number;
    offset: number;
    maxnum: number;
    underbar: boolean;
    beginingCv: boolean;
    requireHead: boolean;
    requireVCV: boolean;
    requireOnlyConsonant: boolean;
    vowel: Array<{ vowel: string; variant: string }>;
    consonant: Array<{ consonant: string; variant: string; length: number }>;
    replace: Array<[before: string, after: string]>;
  }
): MakeOtoTempIni => {
  // 基本プロパティの更新
  baseIni.tempo = state.tempo;
  baseIni.offset = state.offset;
  baseIni.max = state.maxnum;
  baseIni.underbar = state.underbar;
  baseIni.beginingCv = state.beginingCv;
  baseIni.noHead = !state.requireHead;
  baseIni.noVCV = !state.requireVCV;
  baseIni.onlyConsonant = state.requireOnlyConsonant;

  // 母音の変換
  const vowels_: { [key: string]: string } = {};
  state.vowel.forEach((v) => {
    v.variant.split(",").forEach((cv) => {
      vowels_[cv] = v.vowel;
    });
  });
  baseIni.vowel = vowels_;

  // 子音の変換
  const consonant_: {
    [key: string]: {
      consonant: string;
      length: number;
    };
  } = {};
  state.consonant.forEach((c) => {
    c.variant.split(",").forEach((cv) => {
      consonant_[cv] = { consonant: c.consonant, length: c.length };
    });
  });
  baseIni.consonant = consonant_;
  
  baseIni.replace = state.replace;

  return baseIni;
};

/**
 * MakeOtoTempIniから母音設定を変換する
 */
export const convertVowelsFromIni = (iniVowel: { [key: string]: string }): Array<{ vowel: string; variant: string }> => {
  const vowels_: { [vowel: string]: string } = {};
  Object.keys(iniVowel).forEach((cv) => {
    if (Object.keys(vowels_).includes(iniVowel[cv])) {
      vowels_[iniVowel[cv]] += "," + cv;
    } else {
      vowels_[iniVowel[cv]] = cv;
    }
  });
  const vowels__: Array<{ vowel: string; variant: string }> = new Array();
  Object.keys(vowels_).forEach((v) => {
    vowels__.push({ vowel: v, variant: vowels_[v] });
  });
  return vowels__;
};

/**
 * MakeOtoTempIniから子音設定を変換する
 */
export const convertConsonantsFromIni = (iniConsonant: {
  [key: string]: {
    consonant: string;
    length: number;
  };
}): Array<{ consonant: string; variant: string; length: number }> => {
  const consonants_: {
    [consonant: string]: {
      consonant: string;
      variant: string;
      length: number;
    };
  } = {};
  Object.keys(iniConsonant).forEach((cv) => {
    if (Object.keys(consonants_).includes(iniConsonant[cv].consonant)) {
      consonants_[iniConsonant[cv].consonant].variant += "," + cv;
    } else {
      consonants_[iniConsonant[cv].consonant] = {
        consonant: iniConsonant[cv].consonant,
        variant: cv,
        length: iniConsonant[cv].length,
      };
    }
  });
  const consonants__: Array<{
    consonant: string;
    variant: string;
    length: number;
  }> = new Array();
  Object.keys(consonants_).forEach((c) => {
    consonants__.push(consonants_[c]);
  });
  return consonants__;
};
