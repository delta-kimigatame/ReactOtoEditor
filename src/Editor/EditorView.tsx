import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { PaletteMode } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

import { CanvasBase } from "./CanvasBase";
import { EditorButtonArea } from "./EditorButtonArea";
import { layout } from "../config/setting";
import { EditorTable } from "./EditorTable";

import { Log } from "../lib/Logging";

/**
 * エディタ画面。oto.ini読込後に表示される。
 * @param props {@link EditorViewProps}
 * @returns エディタ画面
 */
export const EditorView: React.FC<EditorViewProps> = (props) => {
  // cookieの取得
  const [cookies, setCookie, removeCookie] = useCookies([
    "overlapLock",
    "touchMode",
  ]);
  const { t } = useTranslation();
  /** EditorTableの高さ */
  const [tableHeight, setTableHeight] = React.useState<number>(
    layout.tableMinSize
  );
  /** buttonAreaの高さ */
  const [buttonAreaHeight, setButtonAreaHeight] = React.useState<number>(
    layout.minButtonSize + layout.iconPadding
  );
  /** canvasの高さ */
  const [canvasHeight, setCanvasHeight] = React.useState<number>(
    375 - layout.headerHeight - tableHeight - buttonAreaHeight
  );
  /** 横方向1pixelあたりが何msを表すか */
  const [pixelPerMsec, setPixelPerMsec] = React.useState<number>(1);
  /** recordの更新をtableに通知するための変数 */
  const [updateSignal, setUpdateSignal] = React.useState<number>(0);
  /** 波形の読込状態 */
  const [wavProgress, setWavProgress] = React.useState<boolean>(false);
  /** スペクトログラムの読込状態 */
  const [specProgress, setSpecProgress] = React.useState<boolean>(false);

  /** overlapLockの初期化 */
  const overlapLock_: boolean =
    cookies.overlapLock !== undefined ? cookies.overlapLock : true;
  /** touchmodeの初期化 */
  const touchMode_: boolean =
    cookies.touchMode !== undefined ? cookies.touchMode : true;

  /** overlaplackを使用するか */
  const [overlapLock, setOverlapLock] = React.useState<boolean>(overlapLock_);
  /** touchmodeを使用するか */
  const [touchMode, setTouchMode] = React.useState<boolean>(touchMode_);
  /** toutchModeが更新された際、cookieに保存する。 */
  React.useMemo(() => {
    setCookie("touchMode", touchMode);
    Log.gtag("toggleMode");
  }, [touchMode]);
  /** overlapLockが更新された際、cookieに保存する。 */
  React.useMemo(() => {
    setCookie("overlapLock", overlapLock);
    Log.gtag("toggleOverlap");
  }, [overlapLock]);

  /** 画面サイズが変更されたとき、canvasの大きさを設定する。 */
  React.useEffect(() => {
    Log.log(
      `Canvasの高さ変更 ${
        props.windowSize[1] -
        layout.headerHeight -
        tableHeight -
        buttonAreaHeight -
        24
      }`,
      "EditorView"
    );
    setCanvasHeight(
      props.windowSize[1] -
        layout.headerHeight -
        tableHeight -
        buttonAreaHeight -
        24
    );
  }, [props.windowSize, tableHeight, buttonAreaHeight]);

  /** props.recordが変更されたとき、updateSignalを初期化する。 */
  React.useMemo(() => {
    setUpdateSignal(0);
  }, [props.record]);

  return (
    <>
      <CanvasBase
        canvasWidth={props.windowSize[0]}
        canvasHeight={canvasHeight}
        mode={props.mode}
        color={props.color}
        wav={props.wav}
        record={props.record}
        pixelPerMsec={pixelPerMsec}
        setUpdateSignal={setUpdateSignal}
        touchMode={touchMode}
        overlapLock={overlapLock}
        wavProgress={wavProgress}
        specProgress={specProgress}
        setWavProgress={setWavProgress}
        setSpecProgress={setSpecProgress}
        updateSignal={updateSignal}
      />
      <EditorTable
        windowWidth={props.windowSize[0]}
        windowHeight={props.windowSize[1]}
        setTableHeight={setTableHeight}
        record={props.record}
        targetDir={props.targetDir}
        updateSignal={updateSignal}
      />
      <EditorButtonArea
        windowWidth={props.windowSize[0]}
        windowHeight={props.windowSize[1]}
        setButtonAreaHeight={setButtonAreaHeight}
        oto={props.oto}
        record={props.record}
        setRecord={props.setRecord}
        targetDir={props.targetDir}
        pixelPerMsec={pixelPerMsec}
        setPixelPerMsec={setPixelPerMsec}
        mode={props.mode}
        wav={props.wav}
        overlapLock={overlapLock}
        touchMode={touchMode}
        setOverlapLock={setOverlapLock}
        setTouchMode={setTouchMode}
        setUpdateSignal={setUpdateSignal}
        zip={props.zip}
        zipFileName={props.zipFileName}
        progress={wavProgress || specProgress}
      />
    </>
  );
};

export interface EditorViewProps {
  /** 画面サイズ */
  windowSize: [number, number];
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**キャンバスの色設定 */
  color: string;
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
  /** zipデータ */
  zip: {
    [key: string]: JSZip.JSZipObject;
  } | null;
  /** zipのファイル名 */
  zipFileName: string;
}
