import * as React from "react";
import { PaletteMode } from "@mui/material";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { useTranslation } from "react-i18next";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { EditorButton } from "./EditorButton";

export const PlayBeforePreutterButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const OnPlayBeforePreutter = () => {
    const audioContext = new AudioContext();
    const startFlame = (props.record.offset * props.wav.sampleRate) / 1000;
    const endFlame =
      ((props.record.offset + props.record.pre) * props.wav.sampleRate) / 1000;
    if (endFlame <= startFlame) {
      return;
    }
    const wavData = props.wav.LogicalNormalize(1).slice(startFlame, endFlame);
    const audioBuffer = audioContext.createBuffer(
      props.wav.channels,
      wavData.length,
      props.wav.sampleRate
    );
    const buffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < wavData.length; i++) {
      buffering[i] = wavData[i];
    }
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();
  };
  
  return (
    <>
      <EditorButton
        mode={props.mode}
        size={props.size}
        icon={<VolumeUpIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.playBeforePreutter")}
        onClick={OnPlayBeforePreutter}
        background={
          "linear-gradient(to right,#bdbdbd,#bdbdbd 10%,#bdbdbd 25%,#00ff00 30%,#bdbdbd 35%,#bdbdbd 90%,#ff0000)"
        }
      />
    </>
  );
};

type Props = {
  targetDir: string;
  record: OtoRecord | null;
  wav: Wave;
  mode: PaletteMode;
  size: number;
  iconSize: number;
};
