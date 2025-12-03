import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";
import { LOG } from "../lib/Logging";
import { oto } from "../config/setting";

/**
 * メトロノームの4拍目に先行発声が合うように再生する
 * @param record - 音声のOtoRecord
 * @param wav - Wave音声データ
 * @param metronome - メトロノーム音声データ
 */
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

/**
 * 左ブランクから先行発声までを再生する
 * @param record - 音声のOtoRecord
 * @param wav - Wave音声データ
 */
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
  LOG.gtag("playBefore");
  audioSource.start();
};

/**
 * 先行発声から右ブランクまでを再生する
 * @param record - 音声のOtoRecord
 * @param wav - Wave音声データ
 */
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
  LOG.gtag("playAfter");
  audioSource.start();
};
