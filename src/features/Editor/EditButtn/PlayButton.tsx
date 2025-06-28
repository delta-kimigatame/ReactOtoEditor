import * as React from "react";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { oto } from "../../../config/setting";

import { LOG } from "../../../lib/Logging";
import { useOtoProjectStore } from "../../../store/otoProjectStore";

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

export const OnPlay = (
  record: OtoRecord | null,
  wav: Wave,
  metronome: Wave | null
) => {
  if (metronome === null) {
    return;
  }
  const audioContext = new AudioContext();
  const startFlame = (record.offset * wav.sampleRate) / 1000;
  let endFlame = 0;
  if (record.blank < 0) {
    endFlame = ((record.offset - record.blank) * wav.sampleRate) / 1000;
  } else {
    endFlame = wav.data.length - (record.blank * wav.sampleRate) / 1000;
  }
  const margeStartFlame = Math.floor(
    oto.metronomeFlame - (record.pre * wav.sampleRate) / 1000
  );
  const wavData = wav.LogicalNormalize(1).slice(startFlame, endFlame);
  const metronomeData = metronome.LogicalNormalize(1);
  const audioBuffer = audioContext.createBuffer(
    wav.channels,
    metronomeData.length,
    wav.sampleRate
  );
  const buffering = audioBuffer.getChannelData(0);
  for (let i = 0; i < metronomeData.length; i++) {
    if (i >= margeStartFlame && i < margeStartFlame + endFlame - startFlame) {
      buffering[i] =
        metronomeData[i] * 0.5 + wavData[i - margeStartFlame] * 0.5;
    } else {
      buffering[i] = metronomeData[i] * 0.5;
    }
  }
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);
  LOG.debug(`メトロノーム再生`, "PlayButton");
  LOG.gtag("playMetronome");
  audioSource.start();
};
