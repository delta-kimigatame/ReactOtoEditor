import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { CanvasBase } from "./CanvasBase";
import { EditorButtonArea } from "./EditorButtonArea";
import { layout } from "../../config/setting";
import { EditorTable } from "./EditorTable";

import { Log } from "../../lib/Logging";
import { useWindowSize } from "../../hooks/useWindowSize";

/**
 * エディタ画面。oto.ini読込後に表示される。
 * @param props {@link EditorViewProps}
 * @returns エディタ画面
 */
export const EditorView: React.FC<EditorViewProps> = (props) => {
  const windowSize = useWindowSize();
  /** EditorTableの高さ */
  const [tableHeight, setTableHeight] = React.useState<number>(
    layout.tableMinSize
  );
  /** buttonAreaの高さ */
  const [buttonAreaHeight, setButtonAreaHeight] = React.useState<number>(
    layout.minButtonSize + layout.iconPadding
  );
  /** 横方向1pixelあたりが何msを表すか */
  const [pixelPerMsec, setPixelPerMsec] = React.useState<number>(1);
  /** recordの更新をtableに通知するための変数 */
  const [updateSignal, setUpdateSignal] = React.useState<number>(0);
  /** 波形の読込状態 */
  const [wavProgress, setWavProgress] = React.useState<boolean>(false);
  /** スペクトログラムの読込状態 */
  const [specProgress, setSpecProgress] = React.useState<boolean>(false);

  const canvasHeight = React.useMemo(
    () =>
      windowSize.height -
      layout.headerHeight -
      tableHeight -
      buttonAreaHeight -
      24,
    [windowSize, tableHeight, buttonAreaHeight]
  );

  /** props.recordが変更されたとき、updateSignalを初期化する。 */
  React.useMemo(() => {
    setUpdateSignal(0);
  }, [props.record]);

  return (
    <>
      <CanvasBase
        canvasWidth={windowSize.width}
        canvasHeight={canvasHeight}
        wav={props.wav}
        record={props.record}
        pixelPerMsec={pixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
      />
      <EditorTable
        windowWidth={windowSize.width}
        windowHeight={windowSize.height}
        setTableHeight={setTableHeight}
        record={props.record}
        targetDir={props.targetDir}
        updateSignal={updateSignal}
      />
      <EditorButtonArea
        windowWidth={windowSize.width}
        windowHeight={windowSize.height}
        setButtonAreaHeight={setButtonAreaHeight}
        oto={props.oto}
        record={props.record}
        setRecord={props.setRecord}
        targetDir={props.targetDir}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        wav={props.wav}
        setUpdateSignal={setUpdateSignal}
        progress={wavProgress || specProgress}
      />
    </>
  );
};

export interface EditorViewProps {
  /** 原音設定データ */
  oto: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /** recordを更新する処理 */
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
}
