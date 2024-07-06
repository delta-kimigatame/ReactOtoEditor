import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { AddParams } from "../../Lib/OtoBatchProcess";
import { TargetDirDialogAliasVariant } from "./TargetDirDialogAliasVariant";
import { FullWidthButton } from "../../Common/FullWidthButton";
import { FullWidthTextField } from "../../Common/FullWidthTextField";

/**
 * oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面
 * @param props {@link TargetDirDialogCorrectPanelProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面
 */
export const TargetDirDialogCorrectPanel: React.FC<
  TargetDirDialogCorrectPanelProps
> = (props) => {
  const { t } = useTranslation();
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

  React.useEffect(() => {
    if (props.oto !== null) {
      SetDefaultAliasVariant(props.oto);
    }
  }, [props.oto]);

  const OnCorrectClick = () => {
    if (!isCorrectOffset) {
    } else if (!isCorrectTempo) {
      const offsetDif = afterOffset - beforeOffset;
      AddParams(props.oto, props.targetDir, "offset", offsetDif);
    } else if (!hasPositiveBlank) {
      /** aliasVariantのindex */
      let index = 0;
      /** テンプレートのテンポにおける1拍分の長さ(ms) */
      const beforeTempoMs = (60 / beforeTempo) * 1000;
      /** 変更後のテンポにおける1拍分の長さ(ms) */
      const afterTempoMs = (60 / afterTempo) * 1000;
      /** テンポの変換に伴う各パラメータの変換係数 */
      const tempoRate = afterTempoMs / beforeTempoMs;
      props.oto.GetFileNames(props.targetDir).forEach((f) => {
        props.oto.GetAliases(props.targetDir, f).forEach((a) => {
          const record = props.oto.GetRecord(props.targetDir, f, a);
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
    props.setOto(props.oto);
    props.setDialogOpen(false);
  };
  return (
    <>
      <FullWidthButton onClick={OnCorrectClick}>
        {t("targetDirDialog.submit")}
      </FullWidthButton>
      <FormControlLabel
        control={
          <Checkbox
            checked={isCorrectOffset}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setIsCorrectOffset(e.target.checked);
            }}
          />
        }
        label={t("targetDirDialog.correctOffset")}
      />
      <br />
      {isCorrectOffset && (
        <>
          <FullWidthTextField
            type="number"
            label={t("targetDirDialog.beforeOffset")}
            value={beforeOffset}
            onChange={(e) => {
              setBeforeOffset(parseFloat(e.target.value));
            }}
          />
          <FullWidthTextField
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setIsCorrectTempo(e.target.checked);
                    }}
                  />
                }
                label={t("targetDirDialog.correctTempo")}
              />
              <br />
              {isCorrectTempo && (
                <>
                  <FullWidthTextField
                    type="number"
                    label={t("targetDirDialog.beforeTempo")}
                    value={beforeTempo}
                    onChange={(e) => {
                      setBeforeTempo(parseFloat(e.target.value));
                    }}
                  />
                  <FullWidthTextField
                    type="number"
                    label={t("targetDirDialog.afterTempo")}
                    value={afterTempo}
                    onChange={(e) => {
                      setAfterTempo(parseFloat(e.target.value));
                    }}
                  />
                  <TargetDirDialogAliasVariant
                    oto={props.oto}
                    targetDir={props.targetDir}
                    aliasVariant={aliasVariant}
                    setAliasVariant={setAliasVariant}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export interface TargetDirDialogCorrectPanelProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
}
