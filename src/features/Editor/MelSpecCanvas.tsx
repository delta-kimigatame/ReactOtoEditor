import * as React from "react";
import { Wave } from "utauwav";

import { fftSetting } from "../../config/setting";
import { backgroundColorPallet, specColor } from "../../config/colors";
import { GetColor, GetColorInterpParam } from "../../utils/Color";

import { LOG } from "../../lib/Logging";
import { useThemeMode } from "../../hooks/useThemeMode";
import { useCookieStore } from "../../store/cookieStore";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * メルスペクトログラム表示
 * @param props {@link MelSpecCanvasProps}
 * @returns メルスペクトログラム表示
 */
export const MelSpecCanvas: React.FC<MelSpecCanvasProps> = (props) => {
  const mode = useThemeMode();
  const { colorTheme } = useCookieStore();
  const { wav } = useOtoProjectStore();
  /** canvasへのref */
  const canvas = React.useRef<HTMLCanvasElement>(null);
  /** 背景色 */
  const backgroundColor = React.useMemo(
    () => GetColor(backgroundColorPallet[mode]),
    [mode]
  );
  /** スペクトラムの色 */
  const fillColor = React.useMemo(
    () => specColor[colorTheme][mode],
    [colorTheme, mode]
  );
  /** メルビン1つ当たりの縦幅 */
  const h = React.useMemo(
    () => props.canvasHeight / props.melBins,
    [props.canvasHeight, props.melBins]
  );
  /** wav1フレーム当たりの横幅 */
  const w = React.useMemo(() => {
    if (wav === null) return 0;
    return (props.canvasWidth / wav.data.length) * props.frameWidth;
  }, [props.canvasWidth, wav, props.frameWidth]);

  /** メルスペクトログラムを描画する */
  const renderMelSpec = (
    ctx: CanvasRenderingContext2D,
    sourceWav: Wave,
    melSpec: Float32Array
  ): void => {
    LOG.debug("メルスペクトログラム描画", "MelSpecCanvas");
    const { canvasWidth, canvasHeight, frameWidth, melBins, melSpecMax } = props;
    const hopSize = props.spectrogramHopSize;
    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;
    const bg = backgroundColorPallet[mode];

    for (let index = 0; index < data.length; index += 4) {
      data[index] = bg.r;
      data[index + 1] = bg.g;
      data[index + 2] = bg.b;
      data[index + 3] = 255;
    }

    if (
      props.melFrames <= 0 ||
      melBins <= 0 ||
      melSpec.length < props.melFrames * melBins
    ) {
      ctx.putImageData(imageData, 0, 0);
      props.setSpecProgress(false);
      return;
    }

    const numBlocks = Math.floor(sourceWav.data.length / frameWidth);
    for (let i = 0; i < numBlocks; i++) {
      const analysisPosition =
        (i * frameWidth * props.spectrogramSampleRate) /
        fftSetting.sampleRate;
      const timeIndex1 = Math.min(
        Math.floor(analysisPosition / hopSize),
        props.melFrames - 1
      );
      const timeIndex2 = Math.min(
        Math.ceil(analysisPosition / hopSize),
        props.melFrames - 1
      );
      const steps = analysisPosition % hopSize;

      for (let j = 0; j < melBins; j++) {
        const amp =
          (melSpec[timeIndex1 * melBins + j] * (hopSize - steps)) / hopSize +
          (melSpec[timeIndex2 * melBins + j] * steps) / hopSize;
        // メル値はdB。最大値からの相対dBで色付けし、弱い帯域も可視化する。
        const colorRatio = Number.isFinite(amp)
          ? Math.min(
              1,
              Math.max(
                0,
                (amp - (melSpecMax - fftSetting.melDynamicRangeDb)) /
                  fftSetting.melDynamicRangeDb
              )
            )
          : 0;
        const col = GetColorInterpParam(colorRatio, fillColor);
        const xStart = Math.floor(i * w);
        const xEnd = Math.min(canvasWidth, Math.floor(i * w + w));
        const yStart = Math.max(0, Math.floor(canvasHeight - h * (j + 1)));
        const yEnd = Math.min(canvasHeight, Math.floor(canvasHeight - h * j));

        for (let y = yStart; y < yEnd; y++) {
          for (let x = xStart; x < xEnd; x++) {
            const index = (y * canvasWidth + x) * 4;
            data[index] = col.r;
            data[index + 1] = col.g;
            data[index + 2] = col.b;
            data[index + 3] = 255;
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    props.setSpecProgress(false);
    LOG.debug("メルスペクトログラム描画完了", "MelSpecCanvas");
  };

  React.useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (ctx && props.melSpec !== null && wav !== null) {
      props.setSpecProgress(true);
      renderMelSpec(ctx, wav, props.melSpec);
    } else if (ctx) {
      ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight);
    }
  }, [
    props.melSpec,
    props.melFrames,
    props.melSpecMax,
    fillColor,
    backgroundColor,
    props.canvasWidth,
    props.canvasHeight,
    props.frameWidth,
    props.spectrogramSampleRate,
    props.spectrogramHopSize,
    wav,
  ]);

  return (
    <canvas
      id="melSpecCanvas"
      width={props.canvasWidth}
      height={props.canvasHeight}
      ref={canvas}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
      }}
    />
  );
};

export interface MelSpecCanvasProps {
  /** canvasの横幅 */
  canvasWidth: number;
  /** canvasの縦幅 */
  canvasHeight: number;
  /** frame-majorのメルスペクトログラム */
  melSpec: Float32Array | null;
  /** メルスペクトログラムのフレーム数 */
  melFrames: number;
  /** メルビン数 */
  melBins: number;
  /** メルスペクトログラムの最大値 */
  melSpecMax: number;
  /** wav1フレームあたりを何pixelに描画するか */
  frameWidth: number;
  /** スペクトログラム解析時のサンプリング周波数 */
  spectrogramSampleRate: number;
  /** スペクトログラム解析時のフレームシフト幅 */
  spectrogramHopSize: number;
  /** スペクトログラムの読込状態の更新 */
  setSpecProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
