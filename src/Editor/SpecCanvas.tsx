import * as React from "react";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";

import { fftSetting } from "../settings/setting";
import { backgroundColorPallet, specColor } from "../settings/colors";
import { Color, GetColor, GetColorInterp, GetColorInterpParam } from "../utils/Color";

import { Log } from "../lib/Logging";

/** キャンバスの周波数方向の分解能 */
const rh = Math.ceil(
  fftSetting.maxFrq / (fftSetting.sampleRate / fftSetting.fftsize)
);

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

  /** fft 1パラメータ当たりの縦幅 */
  const h = React.useMemo(() => props.canvasHeight / rh, [props.canvasHeight]);

  /** fft1パラメータ当たりの横幅 */
  const w = React.useMemo(
    () => {
      if(props.wav===null)return 0
      return(props.canvasWidth / props.wav.data.length) * props.frameWidth},
    [props.canvasWidth, props.wav, props.frameWidth]
  );

  const xOffset = React.useMemo(
    () => fftSetting.fftsize / props.frameWidth,
    [props.frameWidth]
  );

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
    const windowSize = fftSetting.windowSize;
    const canvasWidth = props.canvasWidth;
    const canvasHeight = props.canvasHeight;
    const specMax = props.specMax;
    const frameWidth=props.frameWidth
    
    // ImageDataを作成
    const imageData = ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data; // Uint8ClampedArray

    /** 副作用との関係を整理する必要があるが暫定的に直接処理 */
    const bg=backgroundColorPallet[props.mode]
    for (let i = 0; i < data.length; i += 4) {
      data[i] = bg.r;
      data[i + 1] = bg.g;
      data[i + 2] = bg.b;
      data[i + 3] = 255;
    }
    Log.log(`スペクトログラム描画`, "SpecCanvas");
    // メインの描画処理（時間軸方向のループ）
    const numBlocks = Math.floor(wav.data.length / frameWidth);
    for (let i = 0; i < numBlocks; i++) {
      // timeIndex の計算
      const timeIndex1 = Math.min(
        Math.floor((i * frameWidth) / windowSize),
        spec.length - 1
      );
      const timeIndex2 = Math.min(
        Math.ceil((i * frameWidth) / windowSize),
        spec.length - 1
      );
      // 現在のブロック開始位置からの余剰フレーム数
      const steps = (i * frameWidth) % windowSize;
      // 周波数方向のループ
      for (let j = 0; j < rh; j++) {
        // 線形補間による振幅の計算（各ブロックの強度）
        const amp =
          (Math.max(spec[timeIndex1][j], 0) ** 2 * (windowSize - steps)) /
            windowSize +
          (Math.max(spec[timeIndex2][j], 0) ** 2 * steps) / windowSize;
        // 正規化された強度
        const colorRatio = amp / specMax;
        // 各セルの描画色を導出
        const col = GetColorInterpParam(colorRatio, fillColor);
  
        // ブロックの描画領域計算
        const xStart = Math.floor(i * w + xOffset);
        const xEnd = Math.floor(i * w + xOffset + w);
        const yStart = Math.floor(canvasHeight - h * (j + 1));
        const yEnd = Math.floor(canvasHeight - h * j);
  
        // このセルの領域内の各ピクセルに対して色を設定
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
    ctx.putImageData(imageData, 0, 0);//ちゃんとimageData.dataの値はさまざまになっている
    props.setSpecProgress(false);
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
      props.setSpecProgress(true);
      await RenderSpec(ctx, props.wav, props.spec).then(() => {});
    } else if (ctx) {
      Log.log(`canvas初期化`, "SpecCanvas");
      /**キャンバスの初期化 */
      ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
      /** 背景色の描画 */
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, props.canvasWidth, props.canvasHeight);
    }
  };

  return (
    <>
      <canvas
        id="specCanvas"
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
  /** スペクトログラムの読込状態 */
  specProgress: boolean;
  /** スペクトログラムの読込状態の更新 */
  setSpecProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
