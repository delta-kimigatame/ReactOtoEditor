import * as React from "react";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";
import { useTranslation } from "react-i18next";

import { PaletteMode } from "@mui/material";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { EditorButton } from "./EditorButton";
import { Log } from "../../Lib/Logging";

/**
 * 左ブランクから先行発声までを再生するボタン
 * @param props 
 * @returns 左ブランクから先行発声までを再生するボタン
 */
export const PlayBeforePreutterButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  /**
   * 左ブランクから先行発声までを再生する処理
   * @returns 
   */
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
    Log.log(`先行発声まで再生`, "PlayBeforePreutterButton");
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
};
