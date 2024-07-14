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

import { FullWidthSelect } from "../Common/FullWidthSelect";
import { FullWidthTextField } from "../Common/FullWidthTextField";
import { FullWidthButton } from "../Common/FullWidthButton";
import { CommonCheckBox } from "../Common/CommonCheckBox";
import { MakePanelReplaceAccordion } from "./MakePanel/MakePanelReplaceAccordion";
import { MakePanelConsonantAccordion } from "./MakePanel/MakePanelConsonantAccordion";
import { MakePanelVowelAccordion } from "./MakePanel/MakePanelVowelAccordion";
import { MakePanelSelectPreset } from "./MakePanel/MakePanelSelectPreset";

import { Log } from "../Lib/Logging";
import { MakeOtoTempIni } from "../Lib/MakeOtoTemp/Interface";
import { MakeOto, MakeOtoSingle } from "../Lib/MakeOtoTemp/MakeOto";

/**
 * oto.iniを生成する場合のパネル
 * @param props {@link TargetDirDialogTabPanelTemplateProps}
 * @returns oto.iniを生成する場合のパネル
 */
export const TargetDirDialogTabMakePanel: React.FC<
  TargetDirDialogTabMakePanelProps
> = (props) => {
  const { t } = useTranslation();
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
    setOffset(ini.offset);
    setTempo(ini.tempo);
    setMaxnum(ini.max);
    setUnderbar(ini.underbar);
    setBeginingCv(ini.beginingCv);
    setRequireHead(!ini.noHead);
    setRequireVCV(!ini.noVCV);
    setRequireOnlyConsonant(ini.onlyConsonant);
    const vowels_: { [vowel: string]: string } = {};
    Object.keys(ini.vowel).forEach((cv) => {
      if (Object.keys(vowels_).includes(ini.vowel[cv])) {
        vowels_[ini.vowel[cv]] += "," + cv;
      } else {
        vowels_[ini.vowel[cv]] = cv;
      }
    });
    const vowels__: Array<{ vowel: string; variant: string }> = new Array();
    Object.keys(vowels_).forEach((v) => {
      vowels__.push({ vowel: v, variant: vowels_[v] });
    });
    setVowel(vowels__);
    const consonants_: {
      [consonant: string]: {
        consonant: string;
        variant: string;
        length: number;
      };
    } = {};
    Object.keys(ini.consonant).forEach((cv) => {
      if (Object.keys(consonants_).includes(ini.consonant[cv].consonant)) {
        consonants_[ini.consonant[cv].consonant].variant += "," + cv;
      } else {
        consonants_[ini.consonant[cv].consonant] = {
          consonant: ini.consonant[cv].consonant,
          variant: cv,
          length: ini.consonant[cv].length,
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
    setConsonant(consonants__);
    setReplace(ini.replace);
  }, [ini]);

  const OnMakeClick = () => {
    Log.log(`oto.iniを生成します。mode:${mode}`, "TargetDirDialogTabMakePanel");
    if (mode === "single") {
      const oto = MakeOtoSingle(
        props.readZip,
        props.targetDir,
        skipBeginingNumber,
        analyze
      );
      Log.log(`oto.iniを生成しました。`, "TargetDirDialogTabMakePanel");
      props.setOto(oto);
    } else {
      ini.tempo = tempo;
      ini.offset = offset;
      ini.max = maxnum;
      ini.underbar = underbar;
      ini.beginingCv = beginingCv;
      ini.noHead = !requireHead;
      ini.noVCV = !requireVCV;
      ini.onlyConsonant = requireOnlyConsonant;
      const vowels_: { [key: string]: string } = {};
      vowel.forEach((v) => {
        v.variant.split(",").forEach((cv) => {
          vowels_[cv] = v.vowel;
        });
      });
      ini.vowel = vowels_;
      const consonant_: {
        [key: string]: {
          /** 子音 */
          consonant: string;
          /** 子音の標準長さ(ms) */
          length: number;
        };
      } = {};
      consonant.forEach((c) => {
        c.variant.split(",").forEach((cv) => {
          consonant_[cv] = { consonant: c.consonant, length: c.length };
        });
      });
      ini.consonant = consonant_;
      ini.replace = replace;
      Log.log(`ini:${JSON.stringify(ini)}`, "TargetDirDialogTabMakePanel");
      const oto = MakeOto(
        ini,
        Object.keys(props.readZip),
        props.targetDir,
        skipBeginingNumber
      );
      Log.log(`oto.iniを生成しました。`, "TargetDirDialogTabMakePanel");
      props.setOto(oto);
    }
  };

  return (
    <TabPanel value="4" sx={{ p: 0 }}>
      <Box sx={{ p: 1 }}>
        <FullWidthSelect
          label={t("targetDirDialog.makePanel.title")}
          value={mode}
          onChange={OnModeChange}
        >
          <MenuItem value={"single"}>
            {t("targetDirDialog.makePanel.single")}
          </MenuItem>
          <MenuItem value={"multi"}>
            {t("targetDirDialog.makePanel.multi")}
          </MenuItem>
        </FullWidthSelect>
      </Box>
      <Divider />
      {mode === "multi" && (
        <Box sx={{ p: 1 }}>
          <MakePanelSelectPreset setIni={setIni} />
          <Accordion sx={{ m: 1 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
              />
              <FullWidthTextField
                type="number"
                label={t("targetDirDialog.makePanel.settings.offset")}
                value={offset}
                onChange={(e) => {
                  setOffset(e.target.value);
                }}
              />
              <FullWidthTextField
                type="number"
                label={t("targetDirDialog.makePanel.settings.maxnum")}
                value={maxnum}
                onChange={(e) => {
                  setMaxnum(e.target.value);
                }}
              />
              <CommonCheckBox
                checked={underbar}
                setChecked={setUnderbar}
                label={t("targetDirDialog.makePanel.settings.underbar")}
              />
              <br />
              <CommonCheckBox
                checked={beginingCv}
                setChecked={setBeginingCv}
                label={t("targetDirDialog.makePanel.settings.beginingCv")}
              />
              <br />
              <CommonCheckBox
                checked={requireHead}
                setChecked={setRequireHead}
                label={t("targetDirDialog.makePanel.settings.Head")}
              />
              <br />
              <CommonCheckBox
                checked={requireVCV}
                setChecked={setRequireVCV}
                label={t("targetDirDialog.makePanel.settings.VCV")}
              />
              <br />
              <CommonCheckBox
                checked={requireOnlyConsonant}
                setChecked={setRequireOnlyConsonant}
                label={t("targetDirDialog.makePanel.settings.onlyConsonant")}
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
      <CommonCheckBox
        checked={analyze}
        setChecked={setAnalyze}
        label={t("targetDirDialog.makePanel.analyze")}
      />
      <br />
      <CommonCheckBox
        checked={skipBeginingNumber}
        setChecked={setSkipBeginingNumber}
        label={t("targetDirDialog.makePanel.settings.skipBeginingNumber")}
      />
      <br />
      <FullWidthButton onClick={OnMakeClick}>
        {t("targetDirDialog.makePanel.make")}
      </FullWidthButton>
    </TabPanel>
  );
};

export interface TargetDirDialogTabMakePanelProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
}
