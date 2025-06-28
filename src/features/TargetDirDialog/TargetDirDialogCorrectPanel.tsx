import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import { AddParams } from "../../lib/OtoBatchProcess";
import { TargetDirDialogAliasVariant } from "./TargetDirDialogAliasVariant";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { FullWidthTextField } from "../../components/Common/FullWidthTextField";
import { CorrectTempo } from "../../utils/CorrectOto";

import { Log } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面
 * @param props {@link TargetDirDialogCorrectPanelProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル、文字コード指定後の補正画面
 */
export const TargetDirDialogCorrectPanel: React.FC<
  TargetDirDialogCorrectPanelProps
> = (props) => {
  const { t } = useTranslation();
  const { targetDir,setOto,oto } = useOtoProjectStore();
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
    oto_.GetFileNames(targetDir).forEach((f) => {
      oto_.GetAliases(targetDir, f).forEach((a) => {
        if (a.match(/\* /)) {
          /**母音結合はCV */
          av.push("CV");
          Log.log(
            `aliasVariantの推定。エイリアス:${a}、種類:CV`,
            "TargetDirDialogCorrectPanel"
          );
        } else if (a.match(/ [ぁ-んーァ-ヶー一-龠]+/)) {
          /** 半角スペースの後ろに全角文字があればVCV */
          av.push("VCV");
          Log.log(
            `aliasVariantの推定。エイリアス:${a}、種類:VCV`,
            "TargetDirDialogCorrectPanel"
          );
        } else if (a.includes(" ")) {
          /** その他半角スペースがあればVC */
          av.push("VC");
          Log.log(
            `aliasVariantの推定。エイリアス:${a}、種類:VC`,
            "TargetDirDialogCorrectPanel"
          );
        } else {
          av.push("CV");
          Log.log(
            `aliasVariantの推定。エイリアス:${a}、種類:CV`,
            "TargetDirDialogCorrectPanel"
          );
        }
        if (oto_.GetRecord(targetDir, f, a).blank >= 0) {
          positiveBlank = true;
          Log.log(`右ブランクが正の数`, "TargetDirDialogCorrectPanel");
        }
      });
    });
    setAliasVariant(av);
    SetHasPositiveBlank(positiveBlank);
  };

  React.useEffect(() => {
    if (oto !== null) {
      SetDefaultAliasVariant(oto);
    }
  }, [oto]);

  const OnCorrectClick = () => {
    if (!isCorrectOffset) {
      Log.log(`補正無し`, "TargetDirDialogCorrectPanel");
    } else if (!isCorrectTempo) {
      Log.log(
        `offsetのみ補正。テンプレート:${beforeOffset}、変更後:${afterOffset}`,
        "TargetDirDialogCorrectPanel"
      );
      const offsetDif = afterOffset - beforeOffset;
      AddParams(oto, targetDir, "offset", offsetDif);
    } else if (!hasPositiveBlank) {
      Log.log(
        `tempoの補正。テンプレートのオフセット:${beforeOffset}、変更後のオフセット:${afterOffset}。テンプレートのテンポ:${beforeTempo}、変更後のテンポ:${afterTempo}`,
        "TargetDirDialogCorrectPanel"
      );
      CorrectTempo(
        oto,
        targetDir,
        aliasVariant,
        beforeOffset,
        afterOffset,
        beforeTempo,
        afterTempo
      );
    }
    Log.log(`oto.iniの確定`, "TargetDirDialogCorrectPanel");
    setOto(oto);
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
}
