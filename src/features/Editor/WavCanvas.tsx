import * as React from "react";
import { Wave } from "utauwav";

import {
  backgroundColorPallet,
  lineColorPallet,
  wavColorPallet,
} from "../../config/colors";
import { GetColor } from "../../utils/Color";

import { Log } from "../../lib/Logging";
import { useThemeMode } from "../../hooks/useThemeMode";
import { useCookieStore } from "../../store/cookieStore";

/**
 * 波形を表示するキャンバス
 * @param props {@link WavCanvasProps}
 * @returns 波形を表示するキャンバス
 */
export const WavCanvas: React.FC<WavCanvasProps> = (props) => {
  const mode = useThemeMode();
  /** canvasへのref */
  const canvas = React.useRef(null);
  const { colorTheme } = useCookieStore();
  /** 背景色 */
  const backgroundColor = React.useMemo(
    () => GetColor(backgroundColorPallet[mode]),
    [mode]
  );
  /** 区分線の色 */
  const lineColor = React.useMemo(
    () => GetColor(lineColorPallet[mode]),
    [mode]
  );
  /** 波形の色 */
  const wavColor = React.useMemo(
    () => GetColor(wavColorPallet[colorTheme][mode]),
    [colorTheme, mode]
  );

  /**
   * canvasの初期化。0線の描画
   * @param ctx canvasのコンテクスト
   */
  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    Log.log(`canvas初期化`, "WavCanvas");
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, props.canvasHeight / 2);
    ctx.lineTo(props.canvasWidth, props.canvasHeight / 2);
    ctx.stroke();
  };

  /** 線の色が変わった際にキャンバスを初期化する。 */
  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderBase(ctx);
    }
  }, [lineColor]);

  /**
   * wavの描画処理
   * @param ctx canvasのコンテクスト
   * @param wav 描画するwav
   */
  const RenderWave = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave
  ): Promise<void> => {
    Log.log(`wav描画`, "WavCanvas");
    RenderBase(ctx);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.moveTo(0, props.canvasHeight / 2);
    ctx.lineTo(props.canvasWidth, props.canvasHeight / 2);
    ctx.stroke();
    ctx.strokeStyle = wavColor;
    ctx.lineWidth = 1;
    const maxValue = 2 ** (wav.bitDepth - 1) - 1;
    ctx.beginPath();
    ctx.moveTo(0, props.canvasHeight / 2);
    for (let i = 0; i < wav.data.length; i++) {
      ctx.lineTo(
        (i / wav.data.length) * props.canvasWidth,
        ((-wav.data[i] / maxValue) * props.canvasHeight) / 2 +
          props.canvasHeight / 2
      );
    }
    ctx.stroke();
    props.setWavProgress(false);
    Log.log(`wav描画完了`, "WavCanvas");
  };

  /** wav,波形色,キャンバスの大きさが変更した際、波形を再描画する。 */
  React.useEffect(() => {
    OnChangeWav();
  }, [props.wav, wavColor, mode, props.canvasWidth, props.canvasHeight]);

  /**
   * 波形描画を非同期で実施する
   */
  const OnChangeWav = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && props.wav !== null) {
      props.setWavProgress(true);
      RenderWave(ctx, props.wav);
    } else if (ctx) {
      RenderBase(ctx);
    }
  };

  return (
    <>
      <canvas
        id="wavCanvas"
        width={props.canvasWidth}
        height={props.canvasHeight}
        ref={canvas}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        }}
      />
    </>
  );
};

export interface WavCanvasProps {
  /** canvasの横幅 */
  canvasWidth: number;
  /** canvasの縦幅 */
  canvasHeight: number;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /** 波形の読込状態 */
  wavProgress: boolean;
  /** 波形の読込状態の更新 */
  setWavProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
