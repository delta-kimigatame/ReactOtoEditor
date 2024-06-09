import * as React from "react";
import { PaletteMode } from "@mui/material";

import Box from "@mui/material/Box";

import { Wave, WaveAnalyse } from "utauwav";

import { fftSetting, layout } from "../settings/setting";
import {
  backgroundColorPallet,
  lineColorPallet,
  wavColorPallet,
  specColor,
} from "../settings/colors";

export const WavCanvas: React.FC<Props> = (props) => {
  const [spec, setSpec] = React.useState<Array<Array<number>> | null>(null);
  const [width, setWidth] = React.useState<number>(props.canvasSize[0]);
  const [height, setHeight] = React.useState<number>(props.canvasSize[1]);
  const [specMax, setSpecMax] = React.useState<number>(0);
  const [pixelPerMsec, setPixelPerMsec] = React.useState<number>(1);
  const [frameWidth, setFrameWidth] = React.useState<number>(
    (fftSetting.sampleRate * pixelPerMsec) / 1000
  );
  const boxRef = React.useRef(null);
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
  const [fillColor, setFillColor] = React.useState<Array<Color>>(
    specColor[colorTheme][props.mode]
  );

  React.useEffect(() => {
    setColorTheme(props.color);
    setWavColor(GetColor(wavColorPallet[props.color][props.mode]));
    setFillColor(specColor[props.color][props.mode]);
  }, [props.color]);

  React.useEffect(() => {
    setBackgroundColor(GetColor(backgroundColorPallet[props.mode]));
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setWavColor(GetColor(wavColorPallet[colorTheme][props.mode]));
    setFillColor(specColor[colorTheme][props.mode]);
  }, [props.mode]);

  React.useEffect(() => {
    if (props.wav === null) {
      setWidth(props.canvasSize[0]);
      setHeight(props.canvasSize[1]);
    }
  }, [props.canvasSize]);

  React.useEffect(() => {
    if (props.wav === null) {
      setSpec(null);
      setSpecMax(0);
    } else {
      const wa = new WaveAnalyse();
      const s = wa.Spectrogram(props.wav.data);
      setSpec(s);
      setWidth(Math.ceil(props.wav.data.length / frameWidth));
      let sMax = 0;
      for (let i = 0; i < s.length; i++) {
        for (let j = 0; j < s[0].length; j++) {
          if (sMax < Math.max(s[i][j], 0) ** 2) {
            sMax = Math.max(s[i][j], 0) ** 2;
          }
        }
      }
      setSpecMax(sMax);
    }
  }, [props.wav]);

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    ctx.moveTo(0, height / 4);
    ctx.lineTo(width, height / 4);
    ctx.stroke();
  };

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderBase(ctx);
    }
  }, [width, height, lineColor]);

  const RenderWave = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave
  ): Promise<void> => {
    ctx.clearRect(0, 0, width, height / 2 - 1);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height / 2 - 1);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.moveTo(0, height / 4);
    ctx.lineTo(width, height / 4);
    ctx.stroke();
    ctx.strokeStyle = wavColor;
    ctx.lineWidth = 1;
    const maxValue = 2 ** (wav.bitDepth - 1) - 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 4);
    for (let i = 0; i < wav.data.length; i++) {
      ctx.lineTo(
        (i / wav.data.length) * width,
        ((-wav.data[i] / maxValue) * height) / 4 + height / 4
      );
    }
    ctx.stroke();
  };

  React.useEffect(() => {
    OnChangeWav();
  }, [props.wav, wavColor]);

  const OnChangeWav = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && props.wav !== null) {
      RenderWave(ctx, props.wav);
    }
  };

  const RenderSpec = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave,
    spec: Array<Array<number>>
  ): Promise<void> => {
    ctx.clearRect(0, height / 2 + 1, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, height / 2 + 1, width, height);
    const fw = frameWidth;
    const rh = Math.ceil(
      fftSetting.maxFrq / (fftSetting.sampleRate / fftSetting.fftsize)
    );
    const h = height / rh / 2;
    const w = (width / wav.data.length) * fw;
    for (let i = 0; i < wav.data.length / fw; i++) {
      const timeIndex1 = Math.min(
        Math.floor((i * fw) / fftSetting.windowSize),
        spec.length - 1
      );
      const timeIndex2 = Math.min(
        Math.ceil((i * fw) / fftSetting.windowSize),
        spec.length - 1
      );
      const steps = (i * fw) % fftSetting.windowSize;
      for (let j = 0; j < rh; j++) {
        const amp =
          (Math.max(spec[timeIndex1][j], 0) ** 2 *
            (fftSetting.windowSize - steps)) /
            fftSetting.windowSize +
          (Math.max(spec[timeIndex2][j], 0) ** 2 * steps) /
            fftSetting.windowSize;
        const colorRatio = amp / specMax;
        ctx.fillStyle = GetColorInterp(colorRatio, fillColor);
        ctx.fillRect(i * w, height - h * (j + 1), w, h);
      }
    }
  };

  React.useEffect(() => {
    OnChangeSpec();
  }, [spec, fillColor]);

  const OnChangeSpec = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && spec !== null && props.wav !== null) {
      await RenderSpec(ctx, props.wav, spec).then(() => {});
    }
  };

  const OnCanvasClick = (e) => {
    console.log(boxRef.current.scrollLeft + e.clientX);
  };
  return (
    <>
      <Box ref={boxRef} sx={{ overflowX: "scroll" }}>
        <canvas
          id="wavCanvas"
          width={width}
          height={height}
          ref={canvas}
          onClick={OnCanvasClick}
        />
      </Box>
    </>
  );
};

const GetColor = (color: Color): string => {
  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};
const GetColorInterp = (ratio: number, fillColor: Array<Color>): string => {
  const r = Number.isNaN(ratio) ? 0 : ratio;
  const range: number = 1 / (fillColor.length - 1);
  const index1: number = Math.floor(r / range);
  const index2: number = Math.ceil(r / range);
  const rate: number = (r - index1 * range) / range;
  const color: Color = {
    r: fillColor[index1].r * (1 - rate) + fillColor[index2].r * rate,
    g: fillColor[index1].g * (1 - rate) + fillColor[index2].g * rate,
    b: fillColor[index1].b * (1 - rate) + fillColor[index2].b * rate,
  };

  return "rgb(" + color.r + "," + color.g + "," + color.b + ")";
};

type Color = {
  r: number;
  g: number;
  b: number;
};

type Props = {
  canvasSize: [number, number];
  mode: PaletteMode;
  color: string;
  wav: Wave;
};
