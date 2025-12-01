import * as React from "react";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { useOtoProjectStore } from "../../../store/otoProjectStore";
import { OnPlayAfterPreutter } from "../../../utils/play";

/**
 * 先行発声から右ブランクまでを再生するボタン
 * @param props
 * @returns 先行発声から右ブランクまでを再生するボタン
 */
export const PlayAfterPreutterButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { record,wav } = useOtoProjectStore();

  /**
   * 先行発声から右ブランクまでを再生する処理
   * @returns
   */
  const OnPlayAfterPreutter_ = () => {
    OnPlayAfterPreutter(record, wav);
  };

  return (
    <>
      <EditorButton
        data-testid="PlayAfterPreutterButton"
        size={props.size}
        icon={<VolumeUpIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.playAfterPreutter")}
        onClick={OnPlayAfterPreutter_}
        background={
          "linear-gradient(to right,#ff0000,#bdbdbd 10%,#bdbdbd 35%,#0000ff 40%,#bdbdbd 45%)"
        }
      />
    </>
  );
};

interface Props {
  /** ボタンのサイズ */
  size: number;
  /** アイコンのサイズ */
  iconSize: number;
}
