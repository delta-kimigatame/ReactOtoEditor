import * as React from "react";
import { PaletteMode } from "@mui/material";

import { lineColorPallet } from "../settings/colors";

import { GetColor } from "../Lib/Color";
import OtoRecord from "utauoto/dist/OtoRecord";
import { oto } from "../settings/setting";

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
      ctx.fillRect(
        spoint,
        props.canvasHeight / 4,
        point - spoint,
        props.canvasHeight
      );
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
  }, [props.canvasWidth, props.canvasHeight]);

  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderAll(ctx);
    }
  }, [lineColor]);
  const UpdateOto = (target: string, clickX: number) => {
    if (target === "offset") {
      const moveValue = props.record.offset - clickX * props.pixelPerMsec;
      props.record.offset -= moveValue;
      props.record.pre = Math.max(props.record.pre + moveValue, 0);
      if (props.overlapLock) {
        props.record.overlap = props.record.pre / 3;
      } else {
        props.record.overlap += moveValue;
      }
      props.record.velocity = Math.max(
        props.record.velocity + moveValue,
        oto.minParams
      );
      if (props.record.blank < 0) {
        props.record.blank = Math.min(
          props.record.blank - moveValue,
          -2 * oto.minParams
        );
      }
    } else if (target === "overlap") {
      const moveValue =
        props.record.offset +
        props.record.overlap -
        clickX * props.pixelPerMsec;
      props.record.overlap -= moveValue;
    } else if (target === "pre") {
      const moveValue =
        props.record.offset + props.record.pre - clickX * props.pixelPerMsec;
      props.record.offset = props.record.offset - moveValue;
    } else if (target === "velocity") {
      const moveValue =
        props.record.offset +
        props.record.velocity -
        clickX * props.pixelPerMsec;
      props.record.velocity = Math.max(
        props.record.velocity - moveValue,
        oto.minParams
      );
      props.record.blank = Math.min(
        props.record.blank,
        -oto.minParams - props.record.velocity
      );
    } else if (target === "blank") {
      const newBlankPos = props.record.offset - clickX * props.pixelPerMsec;
      props.record.blank = Math.min(
        newBlankPos,
        -oto.minParams - props.record.velocity
      );
    }
  };
  const OnMouseDown = (e) => {
    let t: string | null = null;
    const clickX =
      props.boxRef.current.scrollLeft +
      (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
    const clickY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;

    if (props.touchMode) {
      t = "pre";
    } else {
      const offsetPos = props.record.offset / props.pixelPerMsec;
      const overlapPos =
        (props.record.offset + props.record.overlap) / props.pixelPerMsec;
      const preutterPos =
        (props.record.offset + props.record.pre) / props.pixelPerMsec;
      const velocityPos =
        (props.record.offset + props.record.velocity) / props.pixelPerMsec;
      let blankPos =
        (props.record.offset - props.record.blank) / props.pixelPerMsec;
      if (props.record.blank >= 0) {
        blankPos = props.canvasWidth - props.record.blank / props.pixelPerMsec;
      }

      let minRange = oto.defaultRange;
      if (Math.abs(offsetPos - clickX) < minRange) {
        minRange = Math.abs(offsetPos - clickX);
        t = "offset";
      } 
      if (
        Math.abs(overlapPos - clickX) < minRange &&
        !props.overlapLock
      ) {
        minRange = Math.abs(overlapPos - clickX);
        t = "overlap";
      } 
      if (
        Math.abs(preutterPos - clickX) < minRange ||
        (Math.abs(preutterPos - clickX) < oto.defaultRange &&
          clickY >= props.canvasHeight / 8 &&
          clickY > props.canvasHeight / 4)
      ) {
        minRange = Math.abs(preutterPos - clickX);
        t = "pre";
      } 
      if (Math.abs(velocityPos - clickX) < minRange ||
      (Math.abs(velocityPos - clickX) < oto.defaultRange &&
        clickY >= props.canvasHeight / 4 &&
        clickY > props.canvasHeight / 2)) {
        minRange = Math.abs(velocityPos - clickX);
        t = "velocity";
      } 
      if (Math.abs(blankPos - clickX) < minRange) {
        minRange = Math.abs(blankPos - clickX);
        t = "blank";
      }
    }

    setTargetParam(t);
    if (t !== null) {
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      UpdateOto(t, clickX);
      RenderAll(ctx);
    }
  };

  const OnMouseMove = (e) => {
    if (targetParam !== null) {
      const clickX =
        props.boxRef.current.scrollLeft +
        (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
      const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
      UpdateOto(targetParam, clickX);
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
  canvasWidth: number;
  canvasHeight: number;
  mode: PaletteMode;
  record: OtoRecord;
  boxRef: React.MutableRefObject<any>;
  pixelPerMsec: number;
  SetSclolled: (number) => void;
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  setScrollable: React.Dispatch<React.SetStateAction<boolean>>;
  touchMode: boolean;
  overlapLock: boolean;
};
