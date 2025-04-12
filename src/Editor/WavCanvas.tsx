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
  /** 色設定 */
  const [colorTheme, setColorTheme] = React.useState<string>(props.color);
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
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setWavColor(GetColor(wavColorPallet[colorTheme][props.mode]));
  }, [props.mode]);

  const pathString=React.useMemo(()=>{
    Log.log(`wav描画内容の計算`, "WavCanvas");
    if(props.wav===null) return ""
    const canvasWidth = props.canvasWidth;
    const canvasHeight = props.canvasHeight;
    const maxValue = 2 ** (props.wav.bitDepth - 1) - 1;
    const centerY = canvasHeight / 2;
    const xScale = canvasWidth / props.wav.data.length;

    let pathString = `M 0,${centerY}`;
    for (let i = 0; i < props.wav.data.length; i++) {
      const y = centerY + (-props.wav.data[i] / maxValue) * (canvasHeight / 2);
      const x = i * xScale;
      pathString += ` L ${x},${y}`;
    }
    return pathString

  },[props.wav,props.canvasWidth,props.canvasHeight])

  return (
    <>
      <svg
        width={props.canvasWidth}
        height={props.canvasHeight}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          pointerEvents: "none",
          display: "block",
        }}
      >
        <line
          x1={0}
          x2={props.canvasWidth}
          y1={props.canvasHeight / 2}
          y2={props.canvasHeight / 2}
          stroke={lineColor}
          strokeWidth={1}
        />
        <path
          d={pathString}
          stroke={wavColor}
          strokeWidth={1}
          />
      </svg>
    </>
  );
};

export interface WavCanvasProps {
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
  /** 波形の読込状態 */
  wavProgress: boolean;
  /** 波形の読込状態の更新 */
  setWavProgress: React.Dispatch<React.SetStateAction<boolean>>;
}
