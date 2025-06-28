import * as React from "react";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { EditorButton } from "../../../components/Editor/EditButton/EditorButton";
import { LOG } from "../../../lib/Logging";
import { useOtoProjectStore } from "../../../store/otoProjectStore";

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

export const OnPlayAfterPreutter = (record: OtoRecord | null, wav: Wave) => {
  const audioContext = new AudioContext();
  const startFlame = ((record.offset + record.pre) * wav.sampleRate) / 1000;
  let endFlame = 0;
  if (record.blank < 0) {
    endFlame = ((record.offset - record.blank) * wav.sampleRate) / 1000;
  } else {
    endFlame = wav.data.length - (record.blank * wav.sampleRate) / 1000;
  }
  if (endFlame <= startFlame) {
    return;
  }
  const wavData = wav.LogicalNormalize(1).slice(startFlame, endFlame);
  const audioBuffer = audioContext.createBuffer(
    wav.channels,
    wavData.length,
    wav.sampleRate
  );
  const buffering = audioBuffer.getChannelData(0);
  for (let i = 0; i < wavData.length; i++) {
    buffering[i] = wavData[i];
  }
  const audioSource = audioContext.createBufferSource();
  audioSource.buffer = audioBuffer;
  audioSource.connect(audioContext.destination);
  LOG.debug(`先行発声以降再生`, "PlayAfterPreutterButton");
  Log.gtag("playAfter");
  audioSource.start();
};
