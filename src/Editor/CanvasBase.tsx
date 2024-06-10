import * as React from "react";
import { PaletteMode } from "@mui/material";

import Box from "@mui/material/Box";

import { Wave, WaveAnalyse } from "utauwav";

import { fftSetting } from "../settings/setting";
import { WavCanvas } from "./WavCanvas";
import { SpecCanvas } from "./SpecCanvas";
import { OtoCanvas } from "./OtoCanvas";
import OtoRecord from "utauoto/dist/OtoRecord";

export const CanvasBase: React.FC<Props> = (props) => {
  const [spec, setSpec] = React.useState<Array<Array<number>> | null>(null);
  const [width, setWidth] = React.useState<number>(props.canvasSize[0]);
  const [height, setHeight] = React.useState<number>(props.canvasSize[1]);
  const [specMax, setSpecMax] = React.useState<number>(0);
  const [frameWidth, setFrameWidth] = React.useState<number>(
    (fftSetting.sampleRate * props.pixelPerMsec) / 1000
  );
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    setHeight(props.canvasSize[1]);
    if (props.wav === null) {
      setWidth(props.canvasSize[0]);
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

  React.useEffect(() => {
    setFrameWidth((fftSetting.sampleRate * props.pixelPerMsec) / 1000);
  }, [props.pixelPerMsec]);

  React.useEffect(()=>{
    if(props.wav!==null){
      setWidth(Math.ceil(props.wav.data.length / frameWidth))
    }
  },[frameWidth])

  const SetScrolled = (point: number) => {
    boxRef.current.scrollTo(Math.max(point), 0);
  };

  return (
    <>
      <Box
        ref={boxRef}
        sx={{ overflowX: "scroll", height: height, overflowY: "hidden" }}
      >
        <WavCanvas
          canvasSize={[width, height / 2]}
          mode={props.mode}
          color={props.color}
          wav={props.wav}
        /><br />
        <SpecCanvas
          canvasSize={[width, height / 2]}
          mode={props.mode}
          color={props.color}
          wav={props.wav}
          spec={spec}
          specMax={specMax}
          frameWidth={frameWidth}
        /><br />
        <OtoCanvas
          canvasSize={[width, height]}
          mode={props.mode}
          record={props.record}
          boxRef={boxRef}
          pixelPerMsec={props.pixelPerMsec}
          SetSclolled={SetScrolled}
        />
      </Box>
    </>
  );
};

type Props = {
  canvasSize: [number, number];
  mode: PaletteMode;
  color: string;
  wav: Wave;
  record: OtoRecord;
  pixelPerMsec: number;
};
