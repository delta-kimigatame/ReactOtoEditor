import * as React from "react";
import { PaletteMode } from "@mui/material";
import { CanvasBase } from "./CanvasBase";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";

import { EditorButtonArea } from "./EditorButtonArea";
import { layout } from "../settings/setting";
import { EditorTable } from "./EditorTable";

export const EditorView: React.FC<Props> = (props) => {
  // cookieの取得
  const [cookies, setCookie, removeCookie] = useCookies([
    "overlapLock",
    "touchMode",
  ]);
  const { t } = useTranslation();
  const [tableHeight, setTableHeight] = React.useState<number>(
    layout.tableMinSize
  );
  const [buttonAreaHeight, setButtonAreaHeight] = React.useState<number>(
    layout.minButtonSize + layout.iconPadding
  );
  const [canvasHeight, setCanvasHeight] = React.useState<number>(
    375 - layout.headerHeight - tableHeight - buttonAreaHeight
  );
  const [pixelPerMsec, setPixelPerMsec] = React.useState<number>(1);
  const [updateSignal, setUpdateSignal] = React.useState<number>(0);

  const overlapLock_: boolean =
    cookies.overlapLock !== undefined ? cookies.overlapLock : true;
  const touchMode_: boolean =
    cookies.touchMode !== undefined ? cookies.touchMode : true;
  const [overlapLock, setOverlapLock] = React.useState<boolean>(overlapLock_);
  const [touchMode, setTouchMode] = React.useState<boolean>(touchMode_);
  React.useMemo(() => setCookie("touchMode", touchMode), [touchMode]);
  React.useMemo(() => setCookie("overlapLock", overlapLock), [overlapLock]);

  React.useEffect(() => {
    setCanvasHeight(
      props.windowSize[1] - layout.headerHeight - tableHeight - buttonAreaHeight
    );
  }, [props.windowSize, tableHeight, buttonAreaHeight]);

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
      />
      <EditorTable
        windowSize={props.windowSize}
        setTableHeight={setTableHeight}
        record={props.record}
        targetDir={props.targetDir}
        updateSignal={updateSignal}
      />
      <EditorButtonArea
        windowSize={props.windowSize}
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
      />
    </>
  );
};

type Props = {
  windowSize: [number, number];
  mode: PaletteMode;
  color: string;
  oto: Oto;
  record: OtoRecord | null;
  targetDir: string;
  wav: Wave;
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
};
