import * as React from "react";
import { PaletteMode } from "@mui/material";

import { Wave } from "utauwav";

import {
  backgroundColorPallet,
  lineColorPallet,
  wavColorPallet,
} from "../settings/colors";

import { GetColor } from "../Lib/Color";
import OtoRecord from "utauoto/dist/OtoRecord";

export const OtoCanvas: React.FC<Props> = (props) => {
  const canvas = React.useRef(null);
  const [lineColor, setLineColor] = React.useState<string>(
    GetColor(lineColorPallet[props.mode])
  );
  const [alpha, setAlpha] = React.useState<number>(
    props.mode === "light" ? 0.1 : 0.3
  );
  React.useEffect(() => {
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setAlpha(props.mode === "light" ? 0.1 : 0.3);
  }, [props.mode]);

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    const [width, height] = props.canvasSize;
    ctx.clearRect(0, 0, width, height);
  };

  const RenderOffset = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const [width, height] = props.canvasSize;
      const point = props.record.offset / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,255,0," + alpha + ")";
      ctx.fillRect(0, 0, point, height);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, height);
      ctx.stroke();
    }
  };
  const RenderBlank = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const [width, height] = props.canvasSize;
      let point = 0;
      if (props.record.blank < 0) {
        point = (props.record.offset - props.record.blank) / props.pixelPerMsec;
      } else {
        point = width - props.record.blank / props.pixelPerMsec;
      }
      ctx.fillStyle = "rgba(255,255,0," + alpha + ")";
      ctx.fillRect(point, 0, width - point, height);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, height);
      ctx.stroke();
    }
  };

  const RenderOverlap = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const [width, height] = props.canvasSize;
      const point =
        (props.record.offset + props.record.overlap) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(0,128,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, height / 6);
      ctx.lineTo(point, height);
      ctx.stroke();
      ctx.font = Math.min(48, height / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,128,0)";
      ctx.textAlign = "center";
      ctx.fillText("オ", point, height / 12);
    }
  };
  const RenderPreutter = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const [width, height] = props.canvasSize;
      const point =
        (props.record.offset + props.record.pre) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(255,0,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, height / 3);
      ctx.lineTo(point, height);
      ctx.stroke();
      ctx.font = Math.min(48, height / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.textAlign = "center";
      ctx.fillText("先", point, height / 6);
    }
  };
  const RenderVelocity = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const [width, height] = props.canvasSize;
      const spoint = props.record.offset / props.pixelPerMsec;
      const point =
        (props.record.offset + props.record.velocity) / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,0,255," + alpha + ")";
      ctx.fillRect(spoint, height / 4, point - spoint, height);
      ctx.strokeStyle = "rgb(0,0,255)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, height / 4);
      ctx.lineTo(point, height);
      ctx.stroke();
      ctx.font = Math.min(48, height / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,0,255)";
      ctx.textAlign = "center";
      ctx.fillText("固", point, (height / 16) * 3);
    }
  };

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderBase(ctx);
      RenderOffset(ctx);
      RenderOverlap(ctx);
      RenderPreutter(ctx);
      RenderVelocity(ctx);
      RenderBlank(ctx);
      if (props.record !== null) {
        props.SetSclolled(props.record.offset/ props.pixelPerMsec - 100);
      }
    }
  }, [props.record, props.canvasSize, lineColor]);

  const OnCanvasClick = (e) => {
    console.log(props.boxRef.current.scrollLeft + e.clientX);
  };
  const OnMouseDown = (e) => {
    console.log("down");
    console.log(props.boxRef.current.scrollLeft + e.clientX);
  };
  const OnMouseUp = (e) => {
    console.log("up");
  };
  return (
    <>
      <canvas
        id="otoCanvas"
        width={props.canvasSize[0]}
        height={props.canvasSize[1]}
        ref={canvas}
        style={{
          position: "relative",
          top: -1 * props.canvasSize[1],
          zIndex: 2,
        }}
        onMouseDown={OnMouseDown}
        onTouchStart={OnMouseDown}
        onMouseUp={OnMouseUp}
        onTouchEnd={OnMouseUp}
      />
    </>
  );
};

type Props = {
  canvasSize: [number, number];
  mode: PaletteMode;
  record: OtoRecord;
  boxRef: React.MutableRefObject<any>;
  pixelPerMsec: number;
  SetSclolled: (number) => void;
};
