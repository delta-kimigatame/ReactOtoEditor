import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { AddParams } from "../../Lib/OtoBatchProcess";

/**
 * oto.iniテンプレートを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelTemplateProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelTemplate: React.FC<
  TargetDirDialogTabPanelTemplateProps
> = (props) => {
  const { t } = useTranslation();
  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOto] = React.useState<Oto | null>(null);
  /** 読込中判定 */
  const [processing, setProcessing] = React.useState<boolean>(false);
  /** 読み込んだファイル */
  const [readFile, setReadFile] = React.useState<File | null>(null);
  /** エンコード確認OK */
  const [encodeOk, setEncodeOk] = React.useState<boolean>(false);
  /** オフセット補正の有無 */
  const [isCorrectOffset, setIsCorrectOffset] = React.useState<boolean>(false);
  /** テンポ補正の有無 */
  const [isCorrectTempo, setIsCorrectTempo] = React.useState<boolean>(false);
  /** テンプレートのオフセット */
  const [beforeOffset, setBeforeOffset] = React.useState<number>(0);
  /** 変更後のオフセット */
  const [afterOffset, setAfterOffset] = React.useState<number>(0);
  /** テンポのオフセット */
  const [beforeTempo, setBeforeTempo] = React.useState<number>(0);
  /** 変更後のテンポ */
  const [afterTempo, setAfterTempo] = React.useState<number>(0);
  /** エイリアスの種類 */
  const [aliasVariant, setAliasVariant] = React.useState<Array<
    "CV" | "VCV" | "VC"
  > | null>(null);
  /** 右ブランクが正の値があるか */
  const [hasPositiveBlank, SetHasPositiveBlank] =
    React.useState<boolean>(false);

  const OnReadClick = () => {
    setProcessing(false);
    setReadFile(null);
    inputRef.current.click();
  };
  /**
   * inputのファイルが変更した際のイベント \
   * nullやファイル数が0の時は何もせず終了する。 \
   * ファイルが含まれている場合、1つ目のファイルを`readFile`に代入する。
   * @param e
   */
  const OnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    setProcessing(true);
    setReadFile(e.target.files[0]);
  };
  const LoadOto = (encoding_: string = "SJIS") => {
    const oto_ = new Oto();
    oto_.InputOtoAsync(props.targetDir, readFile, encoding_).then(() => {
      setOto(oto_);
      SetDefaultAliasVariant(oto_);
      setProcessing(false);
    });
  };

  const SetDefaultAliasVariant = (oto_: Oto) => {
    const av = new Array<"CV" | "VCV" | "VC">();
    let positiveBlank = false;
    oto_.GetFileNames(props.targetDir).forEach((f) => {
      oto_.GetAliases(props.targetDir, f).forEach((a) => {
        if (a.match(/\* /)) {
          /**母音結合はCV */
          av.push("CV");
        } else if (a.match(/ [ぁ-んーァ-ヶー一-龠]+/)) {
          /** 半角スペースの後ろに全角文字があればVCV */
          av.push("VCV");
        } else if (a.includes(" ")) {
          /** その他半角スペースがあればVC */
          av.push("VC");
        } else {
          av.push("CV");
        }
        if (oto_.GetRecord(props.targetDir, f, a).blank >= 0) {
          positiveBlank = true;
        }
      });
    });
    setAliasVariant(av);
    SetHasPositiveBlank(positiveBlank);
  };

  const SetEncodeOk_ = (value: boolean) => {
    setEncodeOk(!value);
  };

  const OnAliasVariantChange = (e: SelectChangeEvent, i: number) => {
    const av = aliasVariant.slice();
    av[i] = e.target.value as "CV" | "VCV" | "VC";
    setAliasVariant(av);
  };
  React.useEffect(() => {
    if (readFile !== null) {
      LoadOto(encoding);
    }
  }, [readFile]);

  const OnCorrectClick = () => {
    if (!isCorrectOffset) {
    } else if (!isCorrectTempo) {
      const offsetDif = afterOffset - beforeOffset;
      AddParams(oto, props.targetDir, "offset", offsetDif);
    } else if(!hasPositiveBlank) {
      /** aliasVariantのindex */
      let index = 0;
      /** テンプレートのテンポにおける1拍分の長さ(ms) */
      const beforeTempoMs = (60 / beforeTempo) * 1000;
      /** 変更後のテンポにおける1拍分の長さ(ms) */
      const afterTempoMs = (60 / afterTempo) * 1000;
      /** テンポの変換に伴う各パラメータの変換係数 */
      const tempoRate = afterTempoMs / beforeTempoMs;
      oto.GetFileNames(props.targetDir).forEach((f) => {
        oto.GetAliases(props.targetDir, f).forEach((a) => {
          const record = oto.GetRecord(props.targetDir, f, a);
          /** 先行発声の位置(ms) */
          const position = record.offset + record.pre;
          if (aliasVariant[index] === "VCV") {
            /** このレコードが何拍目か */
            const beats = Math.max(
              Math.floor((position - beforeOffset) / beforeTempoMs),
              0
            );
            /** 拍子の頭とレコードの先行発声の位置の差 */
            const positionDif = position - beforeOffset - beats * beforeTempoMs;
            /** 補正後の先行発声の位置(ms) */
            const targetPosition =
              beats * afterTempoMs + positionDif * tempoRate + afterOffset;
            record.overlap *= tempoRate;
            record.pre *= tempoRate;
            record.velocity *= tempoRate;
            record.blank *= tempoRate;
            record.offset = targetPosition - record.pre;
          } else if (aliasVariant[index] === "VC") {
            /** このレコードが何拍目か + 1 */
            const beats = Math.max(
              Math.ceil((position - beforeOffset) / beforeTempoMs),
              1
            );
            /** 拍子の頭とレコードの先行発声の位置の差 */
            const positionDif = position - beforeOffset - beats * beforeTempoMs;
            /** 補正後の先行発声の位置(ms) */
            const targetPosition =
              beats * afterTempoMs + positionDif + afterOffset;
            /** 先行発声から子音速度までの長さ(ms) */
            const velocityOffset = record.velocity - record.pre;
            /** 先行発声から右ブランクまでの長さ * -1 (ms) */
            const blankOffset = record.pre + record.blank;
            record.overlap *= tempoRate;
            record.pre *= tempoRate;
            record.velocity = record.pre + velocityOffset;
            record.blank = blankOffset - record.pre;
            record.offset = targetPosition - record.pre;
          } else {
            /** このレコードが何拍目か */
            const beats = Math.max(
              Math.floor((position - beforeOffset) / beforeTempoMs),
              0
            );
            /** 拍子の頭とレコードの先行発声の位置の差 */
            const positionDif = position - beforeOffset - beats * beforeTempoMs;
            /** 補正後の先行発声の位置(ms) */
            const targetPosition =
              beats * afterTempoMs + positionDif * tempoRate + afterOffset;
            record.blank *= tempoRate;
            record.offset = targetPosition - record.pre;
          }
          index++;
        });
      });
    }
    props.setOto(oto);
    props.setDialogOpen(false);
  };
  return (
    <TabPanel value="3" sx={{ p: 0 }}>
      <input
        type="file"
        onChange={OnFileChange}
        hidden
        ref={inputRef}
        accept=".ini"
      ></input>
      <Button
        fullWidth
        variant="contained"
        sx={{ m: 1 }}
        onClick={OnReadClick}
        size="large"
        color="inherit"
        disabled={processing}
      >
        {t("targetDirDialog.readTemplate")}
      </Button>
      {oto !== null &&
        (encodeOk ? (
          <>
            <Button
              fullWidth
              variant="contained"
              sx={{ m: 1 }}
              onClick={OnCorrectClick}
              size="large"
              color="inherit"
              disabled={processing}
            >
              {t("targetDirDialog.submit")}
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isCorrectOffset}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setIsCorrectOffset(e.target.checked);
                  }}
                />
              }
              label={t("targetDirDialog.CorrectOffset")}
            />
            <br />
            {isCorrectOffset && (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    m: 1,
                  }}
                  type="number"
                  label={t("targetDirDialog.beforeOffset")}
                  value={beforeOffset}
                  onChange={(e) => {
                    setBeforeOffset(parseFloat(e.target.value));
                  }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  sx={{
                    m: 1,
                  }}
                  type="number"
                  label={t("targetDirDialog.afterOffset")}
                  value={afterOffset}
                  onChange={(e) => {
                    setAfterOffset(parseFloat(e.target.value));
                  }}
                />
                <Divider />
                {hasPositiveBlank ? (
                  <Typography variant="body2" color="error">
                    {t("targetDirDialog.hasPositiveBlankError")}
                  </Typography>
                ) : (
                  <>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isCorrectTempo}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setIsCorrectTempo(e.target.checked);
                          }}
                        />
                      }
                      label={t("targetDirDialog.CorrectTempo")}
                    />
                    <br />
                    {isCorrectTempo && (
                      <>
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            m: 1,
                          }}
                          type="number"
                          label={t("targetDirDialog.beforeTempo")}
                          value={beforeTempo}
                          onChange={(e) => {
                            setBeforeTempo(parseFloat(e.target.value));
                          }}
                        />
                        <TextField
                          fullWidth
                          variant="outlined"
                          sx={{
                            m: 1,
                          }}
                          type="number"
                          label={t("targetDirDialog.afterTempo")}
                          value={afterTempo}
                          onChange={(e) => {
                            setAfterTempo(parseFloat(e.target.value));
                          }}
                        />
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <InputLabel>
                              {t("targetDirDialog.CorrectType")}
                            </InputLabel>
                          </AccordionSummary>
                          <AccordionDetails>
                            {oto.GetLines()[props.targetDir].map((l, i) => (
                              <>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                  <InputLabel>
                                    {l.split("=")[1].split(",")[0]}
                                  </InputLabel>
                                  <Select
                                    label={l.split("=")[1].split(",")[0]}
                                    variant="filled"
                                    color="primary"
                                    value={aliasVariant[i]}
                                    onChange={(e) => {
                                      OnAliasVariantChange(e, i);
                                    }}
                                  >
                                    <MenuItem value="CV">
                                      {t("targetDirDialog.CV")}
                                    </MenuItem>
                                    <MenuItem value="VCV">
                                      {t("targetDirDialog.VCV")}
                                    </MenuItem>
                                    <MenuItem value="VC">
                                      {t("targetDirDialog.VC")}
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Divider />
            <TargetDirDialogButtonArea
              oto={oto}
              setOto={setOto}
              setOtoTemp={setOto}
              setDialogOpen={SetEncodeOk_}
              LoadOto={LoadOto}
              encoding={encoding}
              setEncoding={setEncoding}
            />
            <TargetDirDialogCheckList oto={oto} targetDir={props.targetDir} />
          </>
        ))}
    </TabPanel>
  );
};

export interface TargetDirDialogTabPanelTemplateProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
}
