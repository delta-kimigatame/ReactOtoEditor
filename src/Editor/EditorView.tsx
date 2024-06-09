import * as React from "react";
import { PaletteMode } from "@mui/material";
import { WavCanvas } from "./WavCanvas";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { useTranslation } from "react-i18next";

import { EditorButtonArea } from "./EditorButtonArea";
import { layout } from "../settings/setting";
import { EditorTable } from "./EditorTable";

export const EditorView: React.FC<Props> = (props) => {
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
  React.useEffect(() => {
    setCanvasHeight(
      props.windowSize[1] - layout.headerHeight - tableHeight - buttonAreaHeight
    );
  }, [props.windowSize, tableHeight, buttonAreaHeight]);

  return (
    <>
      <WavCanvas
        canvasSize={[props.windowSize[0], canvasHeight]}
        mode={props.mode}
        color={props.color}
      />
      <EditorTable
        windowSize={props.windowSize}
        setTableHeight={setTableHeight}
        record={props.record}
        targetDir={props.targetDir}
      />
      <EditorButtonArea
        windowSize={props.windowSize}
        setButtonAreaHeight={setButtonAreaHeight}
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
  targetDir:string
};
