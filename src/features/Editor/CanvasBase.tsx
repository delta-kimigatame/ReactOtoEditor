import * as React from "react";
import { Wave, WaveAnalyse } from "utauwav";
import OtoRecord from "utauoto/dist/OtoRecord";


import Box from "@mui/material/Box";

import { fftSetting } from "../../config/setting";
import { WavCanvas } from "./WavCanvas";
import { SpecCanvas } from "./SpecCanvas";
import { OtoCanvas } from "./OtoCanvas";

import { Log } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * エディタのキャンバス
 * @param props {@link CanvasBaseProps}
 * @returns エディタのキャンバス
 */
export const CanvasBase: React.FC<CanvasBaseProps> = (props) => {
  const {wav}=useOtoProjectStore()
  /** wavのスペクトル */
  const spec = React.useMemo(() => {
    if (wav === null) {
      return null;
    } else {
      Log.log(`fft`, "CanvasBase");
      const wa = new WaveAnalyse();
      const s = wa.Spectrogram(wav.data);
      Log.log(`fftend`, "CanvasBase");
      return s;
    }
  }, [wav]);
  /** 縦幅 */
  const [height, setHeight] = React.useState<number>(props.canvasHeight);
  /** スペクトルの最大値 */
  const specMax = React.useMemo(() => {
    if (spec === null) return 0;
    let sMax = 0;
    for (let i = 0; i < spec.length; i++) {
      for (let j = 0; j < spec[0].length; j++) {
        if (sMax < Math.max(spec[i][j], 0) ** 2) {
          sMax = Math.max(spec[i][j], 0) ** 2;
        }
      }
    }
    return sMax;
  }, [spec]);
  /** キャンバスのスクロール可否 */
  const [scrollable, setScrollable] = React.useState<boolean>(false);
  /** wav1フレーム当たりの横幅 */
  const frameWidth = React.useMemo(
    () => (fftSetting.sampleRate * props.pixelPerMsec) / 1000,
    [props.pixelPerMsec]
  );
  /** 横幅 */
  const width = React.useMemo(() => {
    if (wav !== null) {
      Log.log(
        `キャンバスの横幅変更:${Math.ceil(wav.data.length / frameWidth)}`,
        "CanvasBase"
      );
      return Math.ceil(wav.data.length / frameWidth);
    } else {
      return 0;
    }
  }, [wav, frameWidth]);
  /** キャンバスを格納するBoxへのref */
  const boxRef = React.useRef(null);
  /** スクロール用のBoxへのref */
  const scrollBoxRef = React.useRef(null);

  /** 画面サイズが変更された際、キャンバスのサイズも変更する。 \
   * ただし横幅はwav読込後はwavに依存して固定
   */
  React.useEffect(() => {
    setHeight(props.canvasHeight);
  }, [props.canvasHeight, props.canvasWidth]);

  /**
   * canvasを含むBoxを指定の位置までスクロールする
   * @param point スクロールする位置
   */
  const SetScrolled = (point: number, sync: boolean = true) => {
    boxRef.current.scrollTo(Math.max(point), 0);
    if (sync) {
      scrollBoxRef.current.scrollTo(Math.max(point), 0);
    }
  };

  const OnScrollChange = (e) => {
    SetScrolled(e.target.scrollLeft);
  };

  return (
    <>
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: height,
          overflowY: "clip",
        }}
      >
        <WavCanvas
          canvasWidth={width}
          canvasHeight={height / 2}
          wavProgress={props.wavProgress}
          setWavProgress={props.setWavProgress}
        />
        <br />
        <SpecCanvas
          canvasWidth={width}
          canvasHeight={height / 2}
          spec={spec}
          specMax={specMax}
          frameWidth={frameWidth}
          specProgress={props.specProgress}
          setSpecProgress={props.setSpecProgress}
        />
        <br />
        <OtoCanvas
          canvasWidth={width}
          canvasHeight={height}
          boxRef={boxRef}
          pixelPerMsec={props.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={props.setUpdateSignal}
          setScrollable={setScrollable}
          updateSignal={props.updateSignal}
        />
      </Box>
      <Box
        ref={scrollBoxRef}
        sx={{
          overflowX: "scroll",
          height: 24,
          backgroundColor: "#bdbdbd",
        }}
        onScroll={OnScrollChange}
      >
        <Box
          sx={{
            width: width,
          }}
        ></Box>
      </Box>
    </>
  );
};

export interface CanvasBaseProps {
  /** canvasの横幅 */
  canvasWidth: number;
  /** canvasの縦幅 */
  canvasHeight: number;
  /** 横方向1pixelあたりが何msを表すか */
  pixelPerMsec: number;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** 波形の読込状態 */
  wavProgress: boolean;
  /** スペクトログラムの読込状態 */
  specProgress: boolean;
  /** 波形の読込状態の更新 */
  setWavProgress: React.Dispatch<React.SetStateAction<boolean>>;
  /** スペクトログラムの読込状態の更新 */
  setSpecProgress: React.Dispatch<React.SetStateAction<boolean>>;
  /** recordの更新通知 */
  updateSignal: number;
}
