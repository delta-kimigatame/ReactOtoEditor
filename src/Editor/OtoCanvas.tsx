import * as React from "react";
import { PaletteMode } from "@mui/material";

import {
  lineColorPallet,
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
  const [targetParam, setTargetParam] = React.useState<string | null>(null);
  const [alias, setAlias] = React.useState<string | null>(null);
  React.useEffect(() => {
    setLineColor(GetColor(lineColorPallet[props.mode]));
    setAlpha(props.mode === "light" ? 0.1 : 0.3);
  }, [props.mode]);

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, props.canvasWidth, props.canvasHeight);
  };

  const RenderOffset = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point = props.record.offset / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,255,0," + alpha + ")";
      ctx.fillRect(0, 0, point, props.canvasHeight);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
    }
  };
  const RenderBlank = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      let point = 0;
      if (props.record.blank < 0) {
        point = (props.record.offset - props.record.blank) / props.pixelPerMsec;
      } else {
        point = props.canvasWidth - props.record.blank / props.pixelPerMsec;
      }
      ctx.fillStyle = "rgba(255,255,0," + alpha + ")";
      ctx.fillRect(point, 0, props.canvasWidth - point, props.canvasHeight);
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, 0);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
    }
  };

  const RenderOverlap = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point =
        (props.record.offset + props.record.overlap) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(0,128,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 6);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,128,0)";
      ctx.textAlign = "center";
      ctx.fillText("オ", point, props.canvasHeight / 12);
    }
  };
  const RenderPreutter = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const point =
        (props.record.offset + props.record.pre) / props.pixelPerMsec;
      ctx.strokeStyle = "rgb(255,0,0)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 3);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(255,0,0)";
      ctx.textAlign = "center";
      ctx.fillText("先", point, props.canvasHeight / 6);
    }
  };
  const RenderVelocity = (ctx: CanvasRenderingContext2D) => {
    if (props.record !== null) {
      const spoint = props.record.offset / props.pixelPerMsec;
      const point =
        (props.record.offset + props.record.velocity) / props.pixelPerMsec;
      ctx.fillStyle = "rgba(0,0,255," + alpha + ")";
      ctx.fillRect(spoint, props.canvasHeight / 4, point - spoint, props.canvasHeight);
      ctx.strokeStyle = "rgb(0,0,255)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(point, props.canvasHeight / 4);
      ctx.lineTo(point, props.canvasHeight);
      ctx.stroke();
      ctx.font = Math.min(48, props.canvasHeight / 16) + "px sans-serif";
      ctx.fillStyle = "rgb(0,0,255)";
      ctx.textAlign = "center";
      ctx.fillText("固", point, (props.canvasHeight / 16) * 3);
    }
  };

  const RenderAll = (ctx: CanvasRenderingContext2D) => {
    if (ctx) {
      RenderBase(ctx);
      RenderOffset(ctx);
      RenderOverlap(ctx);
      RenderPreutter(ctx);
      RenderVelocity(ctx);
      RenderBlank(ctx);
    }
  };

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
      if (props.record !== null) {
        if (alias !== props.record.alias) {
          props.SetSclolled(props.record.offset / props.pixelPerMsec - 100);
          setAlias(props.record.alias);
        }
      } else {
        setAlias(null);
      }
    }
  }, [props.record]);

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
      if (props.record !== null) {
        props.SetSclolled(props.record.offset / props.pixelPerMsec - 100);
        setAlias(props.record.alias);
      }
    }
  }, [props.canvasWidth,props.canvasHeight]);

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
    }
  }, [lineColor]);

  const OnMouseDown = (e) => {
    const t: string | null = "pre";
    setTargetParam(t);
    if (t !== null) {
      const clickX =
        props.boxRef.current.scrollLeft +
        (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      if (t === "pre") {
        const moveValue =
          props.record.offset + props.record.pre - clickX * props.pixelPerMsec;
        props.record.offset = props.record.offset - moveValue;
      }
      RenderAll(ctx);
    }
  };

  const OnMouseMove = (e) => {
    if (targetParam !== null) {
      const clickX =
        props.boxRef.current.scrollLeft +
        (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      if (targetParam === "pre") {
        const moveValue =
          props.record.offset + props.record.pre - clickX * props.pixelPerMsec;
        props.record.offset = props.record.offset - moveValue;
      }
      RenderAll(ctx);
    }
  };

  const OnMouseUp = (e) => {
    if (targetParam !== null) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      props.setUpdateSignal(Math.random());
      RenderAll(ctx);
      setTargetParam(null);
    }
  };
  return (
    <>
      <canvas
        id="otoCanvas"
        width={props.canvasWidth}
        height={props.canvasHeight}
        ref={canvas}
        style={{
          position: "relative",
          top: -1 * props.canvasHeight,
          zIndex: 2,
        }}
        onMouseDown={OnMouseDown}
        onTouchStart={OnMouseDown}
        onMouseUp={OnMouseUp}
        onTouchEnd={OnMouseUp}
        onMouseMove={OnMouseMove}
        onTouchMove={OnMouseMove}
      />
    </>
  );
};

type Props = {
  canvasWidth:number;
  canvasHeight:number;
  mode: PaletteMode;
  record: OtoRecord;
  boxRef: React.MutableRefObject<any>;
  pixelPerMsec: number;
  SetSclolled: (number) => void;
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  setScrollable: React.Dispatch<React.SetStateAction<boolean>>;
};
