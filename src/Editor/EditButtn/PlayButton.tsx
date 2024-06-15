import * as React from "react";
import { PaletteMode } from "@mui/material";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { useTranslation } from "react-i18next";

import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { EditorButton } from "./EditorButton";
import { oto } from "../../settings/setting";

export const PlayButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [metronome, setMetronome] = React.useState<Wave>(null);
  React.useMemo(() => {
    fetch("/static/metronome.wav").then((res) => {
      res.arrayBuffer().then((buf) => {
        const m = new Wave(buf);
        setMetronome(m);
      });
    });
  }, []);

  const OnPlay = () => {
    const audioContext = new AudioContext();
    const startFlame = (props.record.offset * props.wav.sampleRate) / 1000;
    let endFlame = 0;
    if (props.record.blank < 0) {
      endFlame =
        ((props.record.offset - props.record.blank) * props.wav.sampleRate) /
        1000;
    } else {
      endFlame =
        props.wav.data.length -
        (props.record.blank * props.wav.sampleRate) / 1000;
    }
    const margeStartFlame = Math.floor(
      oto.metronomeFlame - (props.record.pre * props.wav.sampleRate) / 1000
    );
    const wavData = props.wav.LogicalNormalize(1).slice(startFlame, endFlame);
    const metronomeData = metronome.LogicalNormalize(1);
    const audioBuffer = audioContext.createBuffer(
      props.wav.channels,
      metronomeData.length,
      props.wav.sampleRate
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
    audioSource.start();
  };

  return (
    <>
      <EditorButton
        mode={props.mode}
        size={props.size}
        icon={<MusicNoteIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.play")}
        onClick={OnPlay}
        disabled={metronome === null}
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
