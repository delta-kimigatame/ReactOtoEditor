import * as React from "react";
import { styled } from "@mui/system";

import { useTranslation } from "react-i18next";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import TableViewIcon from "@mui/icons-material/TableView";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import LockIcon from "@mui/icons-material/Lock";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import { layout } from "../settings/setting";
import { EditorButton } from "./EditorButton";

export const EditorButtonArea: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [size, setSize] = React.useState<number>(layout.minButtonSize);
  const [iconSize, setIconSize] = React.useState<number>(layout.minIconSize);
  React.useEffect(() => {
    CalcSize();
    props.setButtonAreaHeight(areaRef.current.getBoundingClientRect().height);
  }, [props.windowSize]);
  const areaRef = React.useRef(null);

  const CalcSize = () => {
    const maxHeight = props.windowSize[1] - 319;
    const maxWidth = props.windowSize[0] / 12;
    console.log([maxHeight, maxWidth]);
    const s = Math.max(
      Math.min(maxHeight - layout.iconPadding, maxWidth - layout.iconPadding),
      layout.minButtonSize
    );
    setSize(s);
    setIconSize(Math.max(s - layout.iconPadding, layout.minIconSize));
  };

  return (
    <>
      <Paper
        sx={{
          justifyContent: "space-between",
          display: "flex",
          overflowX: "hidden",
        }}
        ref={areaRef}
      >
        <StyledBox>
          <EditorButton
            size={size}
            icon={<VolumeUpIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.playBeforePreutter")}
            onClick={() => {}}
            background={
              "linear-gradient(to right,#bdbdbd,#bdbdbd 10%,#bdbdbd 25%,#00ff00 30%,#bdbdbd 35%,#bdbdbd 90%,#ff0000)"
            }
          />
          <EditorButton
            size={size}
            icon={<VolumeUpIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.playAfterPreutter")}
            onClick={() => {}}
            background={
              "linear-gradient(to right,#ff0000,#bdbdbd 10%,#bdbdbd 35%,#0000ff 40%,#bdbdbd 45%)"
            }
          />
          <EditorButton
            size={size}
            icon={<MusicNoteIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.play")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            size={size}
            icon={<LockIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.lockOverlap")}
            onClick={() => {}}
          />
          <EditorButton
            size={size}
            icon={<TouchAppIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.touchMode")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            size={size}
            icon={<EditAttributesIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.editAlias")}
            onClick={() => {}}
          />
          <EditorButton
            size={size}
            icon={<TableViewIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.showTable")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            size={size}
            icon={<ZoomInIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomin")}
            onClick={() => {}}
          />
          <EditorButton
            size={size}
            icon={<ZoomOutIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomout")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            size={size}
            icon={<ArrowDropUpIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.prev")}
            onClick={() => {}}
          />
          <EditorButton
            size={size}
            icon={<ArrowDropDownIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.next")}
            onClick={() => {}}
          />
        </StyledBox>
      </Paper>
    </>
  );
};

type Props = {
  windowSize: [number, number];
  setButtonAreaHeight: React.Dispatch<React.SetStateAction<number>>;
};

const StyledBox = styled(Box)({
  justifyContent: "space-around",
  display: "flex",
  flexWrap: "wrap",
  flexGrow: 1,
});
