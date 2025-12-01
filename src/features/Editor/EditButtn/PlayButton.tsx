import * as React from "react";
import { useTranslation } from "react-i18next";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { useOtoProjectStore } from "../../../store/otoProjectStore";
import { OnPlay } from "../../../utils/play";

/**
 * メトロノームの4拍目に先行発声が合うように再生するボタン
 * @param props
 * @returns メトロノームの4拍目に先行発声が合うように再生するボタン
 */
export const PlayButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const {record,wav}=useOtoProjectStore()

  /**
   * メトロノームの4拍目に先行発声が合うように再生する処理
   */
  const OnPlay_ = () => {
    OnPlay(record, wav, props.metronome);
  };

  return (
    <>
      <EditorButton
        data-testid="PlayButton"
        size={props.size}
        icon={<MusicNoteIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.play")}
        onClick={OnPlay_}
        disabled={props.metronome === null}
      />
    </>
  );
};

interface Props {
  /** ボタンのサイズ */
  size: number;
  /** アイコンのサイズ */
  iconSize: number;
  /** メトロノーム */
  metronome: Wave | null;
}
