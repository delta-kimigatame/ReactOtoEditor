import * as React from "react";
import { styled } from "@mui/system";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

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
  const [maxFileIndex, setMaxFileIndex] = React.useState<number>(0);
  const [maxAliasIndex, setMaxAliasIndex] = React.useState<number>(0);
  const [fileIndex, setFileIndex] = React.useState<number>(0);
  const [aliasIndex, setAliasIndex] = React.useState<number>(0);
  React.useEffect(() => {
    CalcSize();
    props.setButtonAreaHeight(areaRef.current.getBoundingClientRect().height);
  }, [props.windowSize]);
  const areaRef = React.useRef(null);

  const CalcSize = () => {
    const maxHeight = props.windowSize[1] - 319;
    const maxWidth = props.windowSize[0] / 12;
    const s = Math.max(
      Math.min(maxHeight - layout.iconPadding, maxWidth - layout.iconPadding),
      layout.minButtonSize
    );
    setSize(s);
    setIconSize(Math.max(s - layout.iconPadding, layout.minIconSize));
  };

  React.useEffect(() => {
    if (props.oto === null) {
      setMaxFileIndex(0);
      setFileIndex(0);
      setAliasIndex(0);
      setMaxAliasIndex(0);
    } else {
      setMaxFileIndex(props.oto.GetFileNames(props.targetDir).length - 1);
    }
  }, [props.oto]);

  React.useEffect(() => {
    if (props.record === null) {
      setAliasIndex(0);
      setMaxAliasIndex(0);
    } else {
      setMaxAliasIndex(
        props.oto.GetAliases(props.targetDir, props.record.filename).length - 1
      );
    }
  }, [props.record]);

  const OnNextAlias = () => {
    if (maxAliasIndex === aliasIndex) {
      if (maxFileIndex !== fileIndex) {
        const filename = props.oto.GetFileNames(props.targetDir)[fileIndex + 1];
        const alias = props.oto.GetAliases(props.targetDir, filename)[0];
        console.log(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
        setFileIndex(fileIndex + 1);
        setAliasIndex(0);
        setMaxAliasIndex(
          props.oto.GetAliases(props.targetDir, filename).length - 1
        );
      }
    } else {
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[aliasIndex + 1];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      setAliasIndex(aliasIndex + 1);
    }
  };

  const OnPrevAlias = () => {
    if (aliasIndex === 0) {
      if (fileIndex !== 0) {
        const filename = props.oto.GetFileNames(props.targetDir)[fileIndex - 1];
        const maxAliases =
          props.oto.GetAliases(props.targetDir, filename).length - 1;
        const alias = props.oto.GetAliases(props.targetDir, filename)[
          maxAliases
        ];
        console.log(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
        setFileIndex(fileIndex + 1);
        setAliasIndex(0);
        setMaxAliasIndex(maxAliases);
      }
    } else {
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[aliasIndex - 1];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      setAliasIndex(aliasIndex - 1);
    }
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
            onClick={OnPrevAlias}
            disabled={aliasIndex === 0 && fileIndex === 0}
          />
          <EditorButton
            size={size}
            icon={<ArrowDropDownIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.next")}
            onClick={OnNextAlias}
            disabled={
              maxAliasIndex === aliasIndex && maxFileIndex === fileIndex
            }
          />
        </StyledBox>
      </Paper>
    </>
  );
};

type Props = {
  windowSize: [number, number];
  setButtonAreaHeight: React.Dispatch<React.SetStateAction<number>>;
  targetDir: string;
  oto: Oto;
  record: OtoRecord | null;
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
};

const StyledBox = styled(Box)({
  justifyContent: "space-around",
  display: "flex",
  flexWrap: "wrap",
  flexGrow: 1,
});
