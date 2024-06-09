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
    const [width, height] = props.canvasSize;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
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
    const [width, height] = props.canvasSize;
    RenderBase(ctx);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.strokeStyle = wavColor;
    ctx.lineWidth = 1;
    const maxValue = 2 ** (wav.bitDepth - 1) - 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    for (let i = 0; i < wav.data.length; i++) {
      ctx.lineTo(
        (i / wav.data.length) * width,
        ((-wav.data[i] / maxValue) * height) / 2 + height / 2
      );
    }
    ctx.stroke();
  };

  React.useEffect(() => {
    OnChangeWav();
  }, [props.wav, wavColor,props.canvasSize]);

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
        width={props.canvasSize[0]}
        height={props.canvasSize[1]}
        ref={canvas}
      />
    </>
  );
};

type Props = {
  canvasSize: [number, number];
  mode: PaletteMode;
  color: string;
  wav: Wave;
};
