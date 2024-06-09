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

  const RenderBase = (ctx: CanvasRenderingContext2D) => {
    const [width, height] = props.canvasSize;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillRect(0, 0, width, height);
  };
  React.useEffect(() => {
    const ctx = (canvas.current as HTMLCanvasElement).getContext("2d");
    if (ctx) {
      RenderBase(ctx);
    }
  }, [props.record]);

  const OnCanvasClick = (e) => {
    console.log(props.boxRef.current.scrollLeft + e.clientX);
  };
  const OnMouseDown = (e) => {
    console.log("down");
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
  record: OtoRecord;
  boxRef: React.MutableRefObject<any>;
};
