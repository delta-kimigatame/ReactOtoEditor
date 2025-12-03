import * as React from "react";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { useOtoProjectStore } from "../../../store/otoProjectStore";
import { OnPlayBeforePreutter } from "../../../utils/play";

/**
 * 左ブランクから先行発声までを再生するボタン
 * @param props
 * @returns 左ブランクから先行発声までを再生するボタン
 */
export const PlayBeforePreutterButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
    const {record,wav}=useOtoProjectStore()

  /**
   * 左ブランクから先行発声までを再生する処理
   * @returns
   */
  const OnPlayBeforePreutter_ = () => {
    OnPlayBeforePreutter(record, wav);
  };

  return (
    <>
      <EditorButton
        data-testid="PlayBeforePreutterButton"
        size={props.size}
        icon={<VolumeUpIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.playBeforePreutter")}
        onClick={OnPlayBeforePreutter_}
        background={
          "linear-gradient(to right,#bdbdbd,#bdbdbd 10%,#bdbdbd 25%,#00ff00 30%,#bdbdbd 35%,#bdbdbd 90%,#ff0000)"
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
