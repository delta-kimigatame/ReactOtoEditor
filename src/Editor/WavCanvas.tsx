import * as React from "react";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import {
  backgroundColorPallet,
  lineColorPallet,
  wavColorPallet,
} from "../settings/colors";
import { GetColor } from "../Lib/Color";

import { Log } from "../Lib/Logging";

/**
 * 波形を表示するキャンバス
 * @param props {@link WavCanvasProps}
 * @returns 波形を表示するキャンバス
 */
export const WavCanvas: React.FC<WavCanvasProps> = (props) => {
  /** canvasへのref */
  const canvas = React.useRef(null);
  /** 色設定 */
  const [colorTheme, setColorTheme] = React.useState<string>(props.color);
  /** 背景色 */
  const [backgroundColor, setBackgroundColor] = React.useState<string>(
    GetColor(backgroundColorPallet[props.mode])
  );
  /** 区分線の色 */
  const [lineColor, setLineColor] = React.useState<string>(
    GetColor(lineColorPallet[props.mode])
  );
  /** 波形の色 */
  const [wavColor, setWavColor] = React.useState<string>(
    GetColor(wavColorPallet[colorTheme][props.mode])
  );

  /** 色設定が変更された際の処理 */
  React.useEffect(() => {
    setColorTheme(props.color);
    setWavColor(GetColor(wavColorPallet[props.color][props.mode]));
  }, [props.color]);

  /** ライトモード・ダークモードが変更された際の処理 */
  React.useEffect(() => {
    setBackgroundColor(GetColor(backgroundColorPallet[props.mode]));
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setWavColor(GetColor(wavColorPallet[colorTheme][props.mode]));
  }, [props.mode]);

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
        ((-wav.data[i] / maxValue) * props.canvasHeight) / 2 + props.canvasHeight / 2
      );
    }
    ctx.stroke();
    Log.log(`wav描画完了`, "WavCanvas");
  };

  /** wav,波形色,キャンバスの大きさが変更した際、波形を再描画する。 */
  React.useEffect(() => {
    OnChangeWav();
  }, [props.wav, wavColor,props.canvasWidth,props.canvasHeight]);

  /**
   * 波形描画を非同期で実施する
   */
  const OnChangeWav = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && props.wav !== null) {
      RenderWave(ctx, props.wav);
    }
  };

  return (
    <>
      <canvas
        id="wavCanvas"
        width={props.canvasWidth}
        height={props.canvasHeight}
        ref={canvas}
      />
    </>
  );
};

export interface WavCanvasProps {
  /** canvasの横幅 */
  canvasWidth:number;
  /** canvasの縦幅 */
  canvasHeight:number;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**キャンバスの色設定 */
  color: string;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
};
