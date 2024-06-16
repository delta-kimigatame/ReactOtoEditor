import * as React from "react";
import { PaletteMode } from "@mui/material";

import Box from "@mui/material/Box";

import { Wave, WaveAnalyse } from "utauwav";

import { fftSetting } from "../settings/setting";
import { WavCanvas } from "./WavCanvas";
import { SpecCanvas } from "./SpecCanvas";
import { OtoCanvas } from "./OtoCanvas";
import OtoRecord from "utauoto/dist/OtoRecord";

/**
 * エディタのキャンバス
 * @param props {@link CanvasBaseProps}
 * @returns エディタのキャンバス
 */
export const CanvasBase: React.FC<CanvasBaseProps> = (props) => {
  /** wavのスペクトル */
  const [spec, setSpec] = React.useState<Array<Array<number>> | null>(null);
  /** 横幅 */
  const [width, setWidth] = React.useState<number>(props.canvasWidth);
  /** 縦幅 */
  const [height, setHeight] = React.useState<number>(props.canvasHeight);
  /** スペクトルの最大値 */
  const [specMax, setSpecMax] = React.useState<number>(0);
  /** キャンバスのスクロール可否 */
  const [scrollable, setScrollable] = React.useState<boolean>(false);
  /** wav1フレーム当たりの横幅 */
  const [frameWidth, setFrameWidth] = React.useState<number>(
    (fftSetting.sampleRate * props.pixelPerMsec) / 1000
  );
  /** キャンバスを格納するBoxへのref */
  const boxRef = React.useRef(null);

  /** 画面サイズが変更された際、キャンバスのサイズも変更する。 \
   * ただし横幅はwav読込後はwavに依存して固定
   */
  React.useEffect(() => {
    setHeight(props.canvasHeight);
    if (props.wav === null) {
      setWidth(props.canvasWidth);
    }
  }, [props.canvasHeight,props.canvasWidth]);

  /**
   * wavが変更されたとき、fftをしてスペクトラムを求める。
   */
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

  /**
   * 拡大縮小操作をされたとき、1pixelあたりの横幅を変更する。
   */
  React.useEffect(() => {
    setFrameWidth((fftSetting.sampleRate * props.pixelPerMsec) / 1000);
  }, [props.pixelPerMsec]);

  /**
   * 1pixelあたりの横幅が変わった時、canvasの横幅を変更する。
   */
  React.useEffect(() => {
    if (props.wav !== null) {
      setWidth(Math.ceil(props.wav.data.length / frameWidth));
    }
  }, [frameWidth]);

  /**
   * canvasを含むBoxを指定の位置までスクロールする
   * @param point スクロールする位置
   */
  const SetScrolled = (point: number) => {
    boxRef.current.scrollTo(Math.max(point), 0);
  };

  return (
    <>
      <Box
        ref={boxRef}
        sx={{
          overflowX: scrollable ? "scroll" : "hidden",
          height: height,
          overflowY: "hidden",
        }}
      >
        <WavCanvas
          canvasWidth={width}
          canvasHeight={height / 2}
          mode={props.mode}
          color={props.color}
          wav={props.wav}
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
        />
      </Box>
    </>
  );
};

export interface CanvasBaseProps {
  /** canvasの横幅 */
  canvasWidth:number;
  /** canvasの縦幅 */
  canvasHeight:number;
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
};
