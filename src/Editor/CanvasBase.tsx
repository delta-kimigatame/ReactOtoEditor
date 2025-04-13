import * as React from "react";
import { Wave, WaveAnalyse } from "utauwav";
import OtoRecord from "utauoto/dist/OtoRecord";

import { PaletteMode } from "@mui/material";

import Box from "@mui/material/Box";

import { fftSetting } from "../settings/setting";
import { WavCanvas } from "./WavCanvas";
import { SpecCanvas } from "./SpecCanvas";
import { OtoCanvas } from "./OtoCanvas";

import { Log } from "../Lib/Logging";

/**
 * エディタのキャンバス
 * @param props {@link CanvasBaseProps}
 * @returns エディタのキャンバス
 */
export const CanvasBase: React.FC<CanvasBaseProps> = (props) => {
  /** wavのスペクトル */
  const spec = React.useMemo(() => {
    if (props.wav === null) {
      return null;
    } else {
      Log.log(`fft`, "CanvasBase");
      const wa = new WaveAnalyse();
      const s = wa.Spectrogram(props.wav.data);
      return s;
    }
  }, [props.wav]);
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
    if (props.wav !== null) {
      Log.log(
        `キャンバスの横幅変更:${Math.ceil(props.wav.data.length / frameWidth)}`,
        "CanvasBase"
      );
      return Math.ceil(props.wav.data.length / frameWidth);
    } else {
      return 0;
    }
  }, [props.wav, frameWidth]);
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
          mode={props.mode}
          color={props.color}
          wav={props.wav}
          wavProgress={props.wavProgress}
          setWavProgress={props.setWavProgress}
        />
        <br />
        <SpecCanvas
          canvasWidth={width}
          canvasHeight={height / 2}
          mode={props.mode}
          color={props.color}
          wav={props.wav}
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
          mode={props.mode}
          record={props.record}
          boxRef={boxRef}
          pixelPerMsec={props.pixelPerMsec}
          SetSclolled={SetScrolled}
          setUpdateSignal={props.setUpdateSignal}
          setScrollable={setScrollable}
          touchMode={props.touchMode}
          overlapLock={props.overlapLock}
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
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**キャンバスの色設定 */
  color: string;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord;
  /** 横方向1pixelあたりが何msを表すか */
  pixelPerMsec: number;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** touchmodeを使用するか */
  touchMode: boolean;
  /** overlaplackを使用するか */
  overlapLock: boolean;
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
