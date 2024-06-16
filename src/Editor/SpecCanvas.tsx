import * as React from "react";
import { PaletteMode } from "@mui/material";

import { Wave } from "utauwav";

import { fftSetting } from "../settings/setting";
import { backgroundColorPallet, specColor } from "../settings/colors";

import { Color, GetColor, GetColorInterp } from "../Lib/Color";

export const SpecCanvas: React.FC<Props> = (props) => {
  const canvas = React.useRef(null);
  const [colorTheme, setColorTheme] = React.useState<string>(props.color);
  const [backgroundColor, setBackgroundColor] = React.useState<string>(
    GetColor(backgroundColorPallet[props.mode])
  );

  const [fillColor, setFillColor] = React.useState<Array<Color>>(
    specColor[colorTheme][props.mode]
  );

  React.useEffect(() => {
    setColorTheme(props.color);
    setFillColor(specColor[props.color][props.mode]);
  }, [props.color]);

  React.useEffect(() => {
    setBackgroundColor(GetColor(backgroundColorPallet[props.mode]));
    setFillColor(specColor[colorTheme][props.mode]);
  }, [props.mode]);

  const RenderSpec = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave,
    spec: Array<Array<number>>
  ): Promise<void> => {
    ctx.clearRect(0, props.canvasHeight + 1, props.canvasWidth, props.canvasHeight);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, props.canvasHeight + 1, props.canvasWidth, props.canvasHeight);
    const rh = Math.ceil(
      fftSetting.maxFrq / (fftSetting.sampleRate / fftSetting.fftsize)
    );
    const h = props.canvasHeight / rh;
    const w = (props.canvasWidth / wav.data.length) * props.frameWidth;
    for (let i = 0; i < wav.data.length / props.frameWidth; i++) {
      const timeIndex1 = Math.min(
        Math.floor((i * props.frameWidth) / fftSetting.windowSize),
        spec.length - 1
      );
      const timeIndex2 = Math.min(
        Math.ceil((i * props.frameWidth) / fftSetting.windowSize),
        spec.length - 1
      );
      const steps = (i * props.frameWidth) % fftSetting.windowSize;
      for (let j = 0; j < rh; j++) {
        const amp =
          (Math.max(spec[timeIndex1][j], 0) ** 2 *
            (fftSetting.windowSize - steps)) /
            fftSetting.windowSize +
          (Math.max(spec[timeIndex2][j], 0) ** 2 * steps) /
            fftSetting.windowSize;
        const colorRatio = amp / props.specMax;
        ctx.fillStyle = GetColorInterp(colorRatio, fillColor);
        ctx.fillRect(
          i * w + fftSetting.fftsize / props.frameWidth,
          props.canvasHeight - h * (j + 1),
          w,
          h
        );
      }
    }
  };

  React.useEffect(() => {
    OnChangeSpec();
  }, [props.spec, fillColor, props.canvasWidth,props.canvasHeight]);

  const OnChangeSpec = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && props.spec !== null && props.wav !== null) {
      await RenderSpec(ctx, props.wav, props.spec).then(() => {});
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

type Props = {
  canvasWidth:number;
  canvasHeight:number;
  mode: PaletteMode;
  color: string;
  wav: Wave;
  spec: Array<Array<number>> | null;
  specMax: number;
  frameWidth:number
};
