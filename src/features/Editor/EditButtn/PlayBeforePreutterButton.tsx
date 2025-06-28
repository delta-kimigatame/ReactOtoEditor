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

export const OnPlayBeforePreutter = (record: OtoRecord | null, wav: Wave) => {
  const audioContext = new AudioContext();
  const startFlame = (record.offset * wav.sampleRate) / 1000;
  const endFlame = ((record.offset + record.pre) * wav.sampleRate) / 1000;
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
  LOG.debug(`先行発声まで再生`, "PlayBeforePreutterButton");
  Log.gtag("playBefore");
  audioSource.start();
};
