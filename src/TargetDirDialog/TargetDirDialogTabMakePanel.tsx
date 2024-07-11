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
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

import { FullWidthSelect } from "../Common/FullWidthSelect";

import { Log } from "../Lib/Logging";
import { MakeOtoTempIni } from "../Lib/MakeOtoTemp/Interface";
import { MakeJpCv, MakeJpCVVC, MakeJpVCV } from "../Lib/MakeOtoTemp/Preset";
import { InputFile } from "../Lib/MakeOtoTemp/Input";
import { FullWidthTextField } from "../Common/FullWidthTextField";
import { FullWidthButton } from "../Common/FullWidthButton";
import { MakeOto } from "../Lib/MakeOtoTemp/MakeOto";

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
  /** ini読込方法 */
  const [loadIni, setLoadIni] = React.useState<"CV" | "VCV" | "CVVC" | "load">(
    null
  );
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

  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);

  /** モード選択セレクトボックスのイベント */
  const OnModeChange = (e: SelectChangeEvent) => {
    setMode(e.target.value as "single" | "multi");
  };

  /** プリセット選択セレクトボックスのイベント */
  const OnLoadIniChange = (e: SelectChangeEvent) => {
    setLoadIni(e.target.value as "CV" | "VCV" | "CVVC" | "load");
    if (e.target.value === "CV") {
      setIni(MakeJpCv());
    } else if (e.target.value === "VCV") {
      setIni(MakeJpVCV());
    } else if (e.target.value === "CVVC") {
      setIni(MakeJpCVVC());
    } else {
      inputRef.current.click();
    }
  };

  /** 隠し要素クリック時のイベント */
  const OnFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    Log.log(
      `ファイル読み込み。${e.target.files[0].name}`,
      "TargetDirDialogTabMakePanel"
    );
    const ini_ = await InputFile(e.target.files[0]);
    setIni(ini_);
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

  const OnVowelChange = (e, index: number, target: "symbol" | "variant") => {
    const vowels_ = vowel.slice();
    if (target === "symbol") {
      vowels_[index] = { vowel: e.target.value, variant: vowel[index].variant };
    } else {
      vowels_[index] = { vowel: vowel[index].vowel, variant: e.target.value };
    }
    setVowel(vowels_);
  };

  const OnVowelAdd = () => {
    const vowels_ = vowel.slice();
    vowels_.push({ vowel: "", variant: "" });
    setVowel(vowels_);
  };
  const OnConsonantChange = (
    e,
    index: number,
    target: "symbol" | "variant" | "length"
  ) => {
    const consonant_ = consonant.slice();
    if (target === "symbol") {
      consonant_[index] = {
        consonant: e.target.value,
        variant: consonant[index].variant,
        length: consonant[index].length,
      };
    } else if (target === "variant") {
      consonant_[index] = {
        consonant: consonant[index].consonant,
        variant: e.target.value,
        length: consonant[index].length,
      };
    } else {
      consonant_[index] = {
        consonant: consonant[index].consonant,
        variant: consonant[index].variant,
        length: e.target.value,
      };
    }
    setConsonant(consonant_);
  };
  const OnConsonantAdd = () => {
    const consonant_ = consonant.slice();
    consonant_.push({ consonant: "", variant: "", length: 0 });
    setConsonant(consonant_);
  };
  const OnReplaceChange = (e, index: number, index2: number) => {
    const replace_ = replace.slice();
    replace_[index][index2] = e.target.value;
    setReplace(replace_);
  };
  const OnReplaceAdd = () => {
    const replace_ = replace.slice();
    replace_.push(["", ""]);
    setReplace(replace_);
  };

  const OnMakeClick = () => {
    if (mode === "single") {
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
      console.log(ini)
      const oto = MakeOto(
        ini,
        Object.keys(props.readZip),
        props.targetDir,
        skipBeginingNumber
      );
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
          <MenuItem value={"single"} disabled>
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
          <input
            type="file"
            onChange={OnFileChange}
            hidden
            ref={inputRef}
            accept=".ini"
          ></input>
          <FullWidthSelect
            label={t("targetDirDialog.makePanel.loadini")}
            value={loadIni}
            onChange={OnLoadIniChange}
          >
            <MenuItem value={"CV"}>
              {t("targetDirDialog.makePanel.CVPreset")}
            </MenuItem>
            <MenuItem value={"VCV"}>
              {t("targetDirDialog.makePanel.VCVPreset")}
            </MenuItem>
            <MenuItem value={"CVVC"}>
              {t("targetDirDialog.makePanel.CVVCPreset")}
            </MenuItem>
            <Divider />
            <MenuItem value={"load"}>
              {t("targetDirDialog.makePanel.load")}
            </MenuItem>
          </FullWidthSelect>
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
              <FormControlLabel
                control={
                  <Checkbox
                    checked={underbar}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setUnderbar(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.makePanel.settings.underbar")}
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={beginingCv}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setBeginingCv(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.makePanel.settings.beginingCv")}
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={requireHead}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRequireHead(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.makePanel.settings.Head")}
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={requireVCV}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRequireVCV(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.makePanel.settings.VCV")}
              />
              <br />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={requireOnlyConsonant}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setRequireOnlyConsonant(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.makePanel.settings.onlyConsonant")}
              />
              <br />
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <InputLabel>
                    {t("targetDirDialog.makePanel.settings.vowel")}
                  </InputLabel>
                </AccordionSummary>
                <AccordionDetails>
                  {vowel.map((v, i) => (
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
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <InputLabel>
                    {t("targetDirDialog.makePanel.settings.consonant")}
                  </InputLabel>
                </AccordionSummary>
                <AccordionDetails>
                  {consonant.map((c, i) => (
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        variant="outlined"
                        sx={{
                          m: 1,
                        }}
                        type="text"
                        label={t(
                          "targetDirDialog.makePanel.settings.consonantSymbol"
                        )}
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
                        label={t(
                          "targetDirDialog.makePanel.settings.consonantVariant"
                        )}
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
                        label={t(
                          "targetDirDialog.makePanel.settings.consonantLength"
                        )}
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
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <InputLabel>
                    {t("targetDirDialog.makePanel.settings.replace")}
                  </InputLabel>
                </AccordionSummary>
                <AccordionDetails>
                  {replace.map((r, i) => (
                    <Box sx={{ display: "flex" }}>
                      <TextField
                        variant="outlined"
                        sx={{
                          m: 1,
                          flexGrow: 1,
                        }}
                        type="text"
                        label={t(
                          "targetDirDialog.makePanel.settings.replaceFilename"
                        )}
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
                        label={t(
                          "targetDirDialog.makePanel.settings.replaceAlias"
                        )}
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
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      <FormControlLabel
        control={
          <Checkbox
            disabled
            checked={analyze}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAnalyze(e.target.checked);
            }}
          />
        }
        label={t("targetDirDialog.makePanel.analyze")}
      />
      <br />
      <FormControlLabel
        control={
          <Checkbox
            checked={skipBeginingNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSkipBeginingNumber(e.target.checked);
            }}
          />
        }
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
