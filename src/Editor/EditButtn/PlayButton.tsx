import * as React from "react";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import MusicNoteIcon from "@mui/icons-material/MusicNote";

import { EditorButton } from "./EditorButton";
import { oto } from "../../settings/setting";

import { Log } from "../../Lib/Logging";

/**
 * メトロノームの4拍目に先行発声が合うように再生するボタン
 * @param props
 * @returns メトロノームの4拍目に先行発声が合うように再生するボタン
 */
export const PlayButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  /** メトロノームのwavデータ */
  const [metronome, setMetronome] = React.useState<Wave>(null);
  /** メトロノームのwavデータを読み込む処理 */
  React.useMemo(() => {
    fetch(location.href + "static/metronome.wav").then((res) => {
      res.arrayBuffer().then((buf) => {
        const m = new Wave(buf);
        setMetronome(m);
      });
    });
  }, []);

  /**
   * メトロノームの4拍目に先行発声が合うように再生する処理
   */
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
    Log.log(`メトロノーム再生`, "PlayButton");
    Log.gtag("playMetronome");
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

interface Props {
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /** ボタンのサイズ */
  size: number;
  /** アイコンのサイズ */
  iconSize: number;
}
