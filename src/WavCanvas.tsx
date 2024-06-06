import * as React from "react";

import Box from "@mui/material/Box";

import { Wave, WaveAnalyse } from "utauwav";

import { fftSetting } from "./settings/setting";

export const WavCanvas: React.FC = () => {
  const [wav, setWav] = React.useState<Wave | null>(null);
  const [spec, setSpec] = React.useState<Array<Array<number>> | null>(null);
  const [width, setWidth] = React.useState<number>(600);
  const [height, setHeight] = React.useState<number>(400);
  const [specMax, setSpecMax] = React.useState<number>(0);
  const [pixelPerMsec, setPixelPerMsec] = React.useState<number>(1);
  const [frameWidth, setFrameWidth] = React.useState<number>(
    (fftSetting.sampleRate * pixelPerMsec) / 1000
  );
  const boxRef = React.useRef(null);
  const canvas = React.useRef(null);
  const bgc = "RGB(0,0,0)";
  const lineColor = "RGB(255,255,255)";
  const waveColor = "RGB(255,255,255)";
  const fillColor: Array<Color> = [
    { r: 0, b: 0, g: 0 },
    { r: 0, b: 0, g: 0 },
    { r: 0, b: 255, g: 0 },
    { r: 0, b: 255, g: 255 },
    { r: 0, b: 0, g: 255 },
    { r: 255, b: 0, g: 255 },
    { r: 255, b: 0, g: 0 },
  ];
  const OnFileChange = (event) => {
    setSpecMax(0);
    const fr = new FileReader();
    fr.addEventListener("load", () => {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      if (ctx) {
        RenderBase(ctx);
      }
      if (fr.result !== null && typeof fr.result !== "string") {
        const w = new Wave(fr.result);
        const wa = new WaveAnalyse();
        w.channels = fftSetting.channels;
        w.bitDepth = fftSetting.bitDepth;
        w.sampleRate = fftSetting.sampleRate;
        w.RemoveDCOffset();
        w.VolumeNormalize();
        setWav(w);
        const s = wa.Spectrogram(w.data);
        setSpec(s);
        setWidth(Math.ceil(w.data.length / frameWidth));
        let sMax = 0;
        for (let i = 0; i < s.length; i++) {
          for (let j = 0; j < s[0].length; j++) {
            if (sMax < s[i][j] ** 2) {
              sMax = s[i][j] ** 2;
            }
          }
        }
        setSpecMax(sMax);
      }
    });
    fr.readAsArrayBuffer(event.target.files[0]);
  };

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = bgc;
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
  }, [width]);

  const RenderWave = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave
  ): Promise<void> => {
    ctx.clearRect(0, 0, width, height / 2 - 1);
    ctx.fillStyle = bgc;
    ctx.fillRect(0, 0, width, height / 2 - 1);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    ctx.moveTo(0, height / 4);
    ctx.lineTo(width, height / 4);
    ctx.stroke();
    ctx.strokeStyle = waveColor;
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
  }, [wav]);

  const OnChangeWav = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && wav !== null) {
      RenderWave(ctx, wav);
      console.log("a");
    }
  };

  const RenderSpec = async (
    ctx: CanvasRenderingContext2D,
    wav: Wave,
    spec: Array<Array<number>>
  ): Promise<void> => {
    ctx.clearRect(0, height / 2 + 1, width, height);
    ctx.fillStyle = bgc;
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
          (Math.max(spec[timeIndex1][j] ** 2, 0) *
            (fftSetting.windowSize - steps)) /
            fftSetting.windowSize +
          (Math.max(spec[timeIndex2][j] ** 2, 0) * steps) /
            fftSetting.windowSize;
        const colorRatio = amp / specMax;
        ctx.fillStyle = GetColor(colorRatio, fillColor);
        ctx.fillRect(i * w, height - h * (j + 1), w, h);
      }
    }
  };

  React.useEffect(() => {
    OnChangeSpec();
  }, [spec]);

  const OnChangeSpec = async () => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx && spec !== null && wav !== null) {
      RenderSpec(ctx, wav, spec);
      console.log("b");
    }
  };

  return (
    <>
      <input type="file" onChange={OnFileChange}></input>
      <br />
      <Box ref={boxRef} sx={{ overflowX: "scroll" }}>
        <canvas id="wavCanvas" width={width} height={height} ref={canvas} />
      </Box>
    </>
  );
};

const GetColor = (ratio: number, fillColor: Array<Color>): string => {
  const range: number = 1 / (fillColor.length - 1);
  const index1: number = Math.floor(ratio / range);
  const index2: number = Math.ceil(ratio / range);
  const rate: number = (ratio - index1 * range) / range;
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
