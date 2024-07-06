import * as React from "react";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import { fftSetting } from "../settings/setting";
import { backgroundColorPallet, specColor } from "../settings/colors";
import { Color, GetColor, GetColorInterp } from "../Lib/Color";

import { Log } from "../Lib/Logging";
/**
 * スペクトラム表示
 * @param props {@link SpecCanvasProps}
 * @returns スペクトラム表示
 */
export const SpecCanvas: React.FC<SpecCanvasProps> = (props) => {
  /** canvasへのref */
  const canvas = React.useRef(null);
  /** 色設定 */
  const [colorTheme, setColorTheme] = React.useState<string>(props.color);
  /** 背景色 */
  const [backgroundColor, setBackgroundColor] = React.useState<string>(
    GetColor(backgroundColorPallet[props.mode])
  );
  /** スペクトラムの色 */
  const [fillColor, setFillColor] = React.useState<Array<Color>>(
    specColor[colorTheme][props.mode]
  );
  /** 色設定が変更された際の処理 */
  React.useEffect(() => {
    setColorTheme(props.color);
    setFillColor(specColor[props.color][props.mode]);
  }, [props.color]);
  /** ライトモード・ダークモードが変更された際の処理 */
  React.useEffect(() => {
    setBackgroundColor(GetColor(backgroundColorPallet[props.mode]));
    setFillColor(specColor[colorTheme][props.mode]);
  }, [props.mode]);

  /**
   * スペクトラムの描画処理
   * @param ctx canvasのコンテクスト
   * @param wav 描画するspectrumの元wav
   * @param spec 描画するspectrum
   */
  const RenderSpec = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave,
    spec: Array<Array<number>>
  ): Promise<void> => {
    Log.log(`canvas初期化`, "SpecCanvas");
    /**キャンバスの初期化 */
    ctx.clearRect(
      0,
      0,
      props.canvasWidth,
      props.canvasHeight
    );
    /** 背景色の描画 */
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      0,
      0,
      props.canvasWidth,
      props.canvasHeight
    );
    Log.log(`スペクトログラム描画`, "SpecCanvas");
    /** キャンバスの周波数方向の分解能 */
    const rh = Math.ceil(
      fftSetting.maxFrq / (fftSetting.sampleRate / fftSetting.fftsize)
    );
    /** fft 1パラメータ当たりの縦幅 */
    const h = props.canvasHeight / rh;
    /** fft1パラメータ当たりの横幅 */
    const w = (props.canvasWidth / wav.data.length) * props.frameWidth;
    /** 描画のメイン処理 時間軸方向のループ */
    for (let i = 0; i < wav.data.length / props.frameWidth; i++) {
      /** spectrum描画位置直前のインデックス */
      const timeIndex1 = Math.min(
        Math.floor((i * props.frameWidth) / fftSetting.windowSize),
        spec.length - 1
      );
      /** spectrum描画位置直後のインデックス */
      const timeIndex2 = Math.min(
        Math.ceil((i * props.frameWidth) / fftSetting.windowSize),
        spec.length - 1
      );
      /** spectrum描画位置直前からの経過フレーム数 */
      const steps = (i * props.frameWidth) % fftSetting.windowSize;
      /** 周波数方向のループ */
      for (let j = 0; j < rh; j++) {
        /** 描画座標における強さ。timeIndex1とtimeIndex2を使って線形補間 */
        const amp =
          (Math.max(spec[timeIndex1][j], 0) ** 2 *
            (fftSetting.windowSize - steps)) /
            fftSetting.windowSize +
          (Math.max(spec[timeIndex2][j], 0) ** 2 * steps) /
            fftSetting.windowSize;
        /** 描画座標における強さを0 ～ 1で正規化 */
        const colorRatio = amp / props.specMax;
        /** 描画色の設定 */
        ctx.fillStyle = GetColorInterp(colorRatio, fillColor);
        /** 描画 */
        ctx.fillRect(
          i * w + fftSetting.fftsize / props.frameWidth,
          props.canvasHeight - h * (j + 1),
          w,
          h
        );
      }
    }
    Log.log(`スペクトログラム描画完了`, "SpecCanvas");
  };

  /** スペクトラム、色設定、キャンバスサイズが変わった時に再描画 */
  React.useEffect(() => {
    OnChangeSpec();
  }, [props.spec, fillColor, props.canvasWidth, props.canvasHeight]);

  /** スペクトラムの変更処理を非同期で実施する */
  const OnChangeSpec = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && props.spec !== null && props.wav !== null) {
      await RenderSpec(ctx, props.wav, props.spec).then(() => {});
    }else if(ctx){
      Log.log(`canvas初期化`, "SpecCanvas");
      /**キャンバスの初期化 */
      ctx.clearRect(
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );
      /** 背景色の描画 */
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(
        0,
        0,
        props.canvasWidth,
        props.canvasHeight
      );
    }
  };

  return (
    <>
      <canvas
        id="specCanvas"
        width={props.canvasWidth}
        height={props.canvasHeight}
        ref={canvas}
      />
    </>
  );
};

export interface SpecCanvasProps {
  /** canvasの横幅 */
  canvasWidth: number;
  /** canvasの縦幅 */
  canvasHeight: number;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**キャンバスの色設定 */
  color: string;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /** 現在のwavに関連するspectrumデータ */
  spec: Array<Array<number>> | null;
  /** 現在のwavに関連するspectrumデータの最大値 */
  specMax: number;
  /** wav1フレームあたりを何pixelに描画するか */
  frameWidth: number;
}
