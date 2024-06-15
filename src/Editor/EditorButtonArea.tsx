import * as React from "react";
import { styled } from "@mui/system";
import { PaletteMode } from "@mui/material";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

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
import { EditorButton } from "./EditButtn/EditorButton";
import { NextAliasButton } from "./EditButtn/NextAliasButton";
import { PrevAliasButton } from "./EditButtn/PrevAliasButtn";

export const EditorButtonArea: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [size, setSize] = React.useState<number>(layout.minButtonSize);
  const [iconSize, setIconSize] = React.useState<number>(layout.minIconSize);
  const [maxFileIndex, setMaxFileIndex] = React.useState<number>(0);
  const [maxAliasIndex, setMaxAliasIndex] = React.useState<number>(0);
  const [fileIndex, setFileIndex] = React.useState<number>(0);
  const [aliasIndex, setAliasIndex] = React.useState<number>(0);
  const [metronome, setMetronome] = React.useState<Wave>(null);
  React.useMemo(() => {
    console.log(location.protocol);
    console.log(location.host);
    fetch("/static/metronome.wav").then((res) => {
      res.arrayBuffer().then((buf) => {
        const m = new Wave(buf);
        setMetronome(m);
      });
    });
  }, []);

  React.useEffect(() => {
    CalcSize();
    props.setButtonAreaHeight(areaRef.current.getBoundingClientRect().height);
  }, [props.windowSize]);
  const areaRef = React.useRef(null);

  const CalcSize = () => {
    const maxHeight = props.windowSize[1] - 319;
    const maxWidth = props.windowSize[0] / 12;
    const s = Math.min(
      Math.max(
        Math.min(maxHeight - layout.iconPadding, maxWidth - layout.iconPadding),
        layout.minButtonSize
      ),
      layout.maxButtonSize
    );
    setSize(s);
    setIconSize(Math.min(Math.max(s - layout.iconPadding, layout.minIconSize)));
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

  const OnPlayBeforePreutter = () => {
    const audioContext = new AudioContext();
    const startFlame = (props.record.offset * props.wav.sampleRate) / 1000;
    const endFlame =
      ((props.record.offset + props.record.pre) * props.wav.sampleRate) / 1000;
    if (endFlame <= startFlame) {
      return;
    }
    const wavData = props.wav.LogicalNormalize(1).slice(startFlame, endFlame);
    const audioBuffer = audioContext.createBuffer(
      props.wav.channels,
      wavData.length,
      props.wav.sampleRate
    );
    const buffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < wavData.length; i++) {
      buffering[i] = wavData[i];
    }
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();
  };
  const OnPlayAfterPreutter = () => {
    const audioContext = new AudioContext();
    const startFlame =
      ((props.record.offset + props.record.pre) * props.wav.sampleRate) / 1000;
    let endFlame = 0;
    if (props.record.blank < 0) {
      endFlame =
        ((props.record.offset - props.record.blank) * props.wav.sampleRate) /
        1000;
    } else {
      endFlame =
        props.wav.data.length -
        (props.record.blank * props.wav.sampleRate) / 1000;
    }
    if (endFlame <= startFlame) {
      return;
    }
    const wavData = props.wav.LogicalNormalize(1).slice(startFlame, endFlame);
    const audioBuffer = audioContext.createBuffer(
      props.wav.channels,
      wavData.length,
      props.wav.sampleRate
    );
    const buffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < wavData.length; i++) {
      buffering[i] = wavData[i];
    }
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();
  };

  const OnPlay = () => {
    const audioContext = new AudioContext();
    const startFlame = (props.record.offset * props.wav.sampleRate) / 1000;
    let endFlame = 0;
    if (props.record.blank < 0) {
      endFlame =
        ((props.record.offset - props.record.blank) * props.wav.sampleRate) /
        1000;
    } else {
      endFlame =
        props.wav.data.length -
        (props.record.blank * props.wav.sampleRate) / 1000;
    }
    const margeStartFlame =
      Math.floor(66150 - (props.record.pre * props.wav.sampleRate) / 1000);
    const wavData = props.wav.LogicalNormalize(1).slice(startFlame, endFlame);
    const metronomeData = metronome.LogicalNormalize(1);
    const audioBuffer = audioContext.createBuffer(
      props.wav.channels,
      metronomeData.length,
      props.wav.sampleRate
    );
    const buffering = audioBuffer.getChannelData(0);
    for (let i = 0; i < metronomeData.length; i++) {
      if (i >= margeStartFlame && i < margeStartFlame + endFlame - startFlame) {
        buffering[i] =
          metronomeData[i] * 0.5 +
          wavData[i - margeStartFlame] * 0.5;
      } else {
        buffering[i] = metronomeData[i] * 0.5;
      }
    }
    const audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start();
  };

  const OnZoomIn = () => {
    if (props.pixelPerMsec === 20) {
      props.setPixelPerMsec(10);
    } else if (props.pixelPerMsec === 10) {
      props.setPixelPerMsec(5);
    } else if (props.pixelPerMsec === 5) {
      props.setPixelPerMsec(2);
    } else if (props.pixelPerMsec === 2) {
      props.setPixelPerMsec(1);
    }
  };
  const OnZoomOut = () => {
    if (props.pixelPerMsec === 1) {
      props.setPixelPerMsec(2);
    } else if (props.pixelPerMsec === 2) {
      props.setPixelPerMsec(5);
    } else if (props.pixelPerMsec === 5) {
      props.setPixelPerMsec(10);
    } else if (props.pixelPerMsec === 10) {
      props.setPixelPerMsec(20);
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
            mode={props.mode}
            size={size}
            icon={<VolumeUpIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.playBeforePreutter")}
            onClick={OnPlayBeforePreutter}
            background={
              "linear-gradient(to right,#bdbdbd,#bdbdbd 10%,#bdbdbd 25%,#00ff00 30%,#bdbdbd 35%,#bdbdbd 90%,#ff0000)"
            }
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<VolumeUpIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.playAfterPreutter")}
            onClick={OnPlayAfterPreutter}
            background={
              "linear-gradient(to right,#ff0000,#bdbdbd 10%,#bdbdbd 35%,#0000ff 40%,#bdbdbd 45%)"
            }
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<MusicNoteIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.play")}
            onClick={OnPlay}
            disabled={metronome === null}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<LockIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.lockOverlap")}
            onClick={() => {}}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<TouchAppIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.touchMode")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<EditAttributesIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.editAlias")}
            onClick={() => {}}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<TableViewIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.showTable")}
            onClick={() => {}}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<ZoomInIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomin")}
            disabled={props.pixelPerMsec === 1}
            onClick={OnZoomIn}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<ZoomOutIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomout")}
            onClick={OnZoomOut}
            disabled={props.pixelPerMsec === 20}
          />
        </StyledBox>
        <StyledBox>
          <PrevAliasButton
            targetDir={props.targetDir}
            oto={props.oto}
            record={props.record}
            setRecord={props.setRecord}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
            fileIndex={fileIndex}
            aliasIndex={aliasIndex}
            maxFileIndex={maxFileIndex}
            maxAliasIndex={maxAliasIndex}
            setFileIndex={setFileIndex}
            setAliasIndex={setAliasIndex}
            setMaxAliasIndex={setMaxAliasIndex}
          />
          <NextAliasButton
            targetDir={props.targetDir}
            oto={props.oto}
            record={props.record}
            setRecord={props.setRecord}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
            fileIndex={fileIndex}
            aliasIndex={aliasIndex}
            maxFileIndex={maxFileIndex}
            maxAliasIndex={maxAliasIndex}
            setFileIndex={setFileIndex}
            setAliasIndex={setAliasIndex}
            setMaxAliasIndex={setMaxAliasIndex}
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
  wav: Wave;
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
  pixelPerMsec: number;
  setPixelPerMsec: React.Dispatch<React.SetStateAction<number>>;
  mode: PaletteMode;
};

const StyledBox = styled(Box)({
  justifyContent: "space-around",
  display: "flex",
  flexWrap: "wrap",
  flexGrow: 1,
});
