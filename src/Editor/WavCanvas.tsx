import * as React from "react";
import { PaletteMode } from "@mui/material";

import { Wave } from "utauwav";

import {
  backgroundColorPallet,
  lineColorPallet,
  wavColorPallet,
} from "../settings/colors";

import { GetColor } from "../Lib/Color";

export const WavCanvas: React.FC<Props> = (props) => {
  const canvas = React.useRef(null);
  const [colorTheme, setColorTheme] = React.useState<string>(props.color);
  const [backgroundColor, setBackgroundColor] = React.useState<string>(
    GetColor(backgroundColorPallet[props.mode])
  );
  const [lineColor, setLineColor] = React.useState<string>(
    GetColor(lineColorPallet[props.mode])
  );
  const [wavColor, setWavColor] = React.useState<string>(
    GetColor(wavColorPallet[colorTheme][props.mode])
  );

  React.useEffect(() => {
    setColorTheme(props.color);
    setWavColor(GetColor(wavColorPallet[props.color][props.mode]));
  }, [props.color]);

  React.useEffect(() => {
    setBackgroundColor(GetColor(backgroundColorPallet[props.mode]));
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setWavColor(GetColor(wavColorPallet[colorTheme][props.mode]));
  }, [props.mode]);

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
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

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderBase(ctx);
    }
  }, [lineColor]);

  const RenderWave = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave
  ): Promise<void> => {
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
  };

  React.useEffect(() => {
    OnChangeWav();
  }, [props.wav, wavColor,props.canvasWidth,props.canvasHeight]);

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

type Props = {
  canvasWidth:number;
  canvasHeight:number;
  mode: PaletteMode;
  color: string;
  wav: Wave;
};
