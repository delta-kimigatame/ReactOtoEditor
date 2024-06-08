import * as React from "react";
import { PaletteMode } from "@mui/material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
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

export const EditorButtonArea: React.FC<Props> = (props) => {
  const [size, setSize] = React.useState<number>(layout.minButtonSize);
  const [iconSize, setIconSize] = React.useState<number>(layout.minIconSize);
  React.useEffect(() => {
    CalcSize();
    props.setButtonAreaHeight(areaRef.current.getBoundingClientRect().height);
  }, [props.windowSize]);
  const areaRef = React.useRef(null);

  const CalcSize = () => {
    const MaxHeight = props.windowSize[1] - 319;
    const MaxWidth = props.windowSize[0] / 11;
    const s = Math.max(
      Math.min(MaxHeight - layout.iconPadding, MaxWidth - layout.iconPadding),
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
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <IconButton>
            <Avatar
              sx={{
                width: size,
                height: size,
                background:
                  "linear-gradient(to right,#bdbdbd,#bdbdbd 10%,#bdbdbd 25%,#00ff00 30%,#bdbdbd 35%,#bdbdbd 90%,#ff0000)",
              }}
            >
              <VolumeUpIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar
              sx={{
                width: size,
                height: size,
                background:
                  "linear-gradient(to right,#ff0000,#bdbdbd 10%,#bdbdbd 35%,#0000ff 40%,#bdbdbd 45%)",
              }}
            >
              <VolumeUpIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <MusicNoteIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
        </Box>

        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <LockIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <TouchAppIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
        </Box>
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <EditAttributesIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <TableViewIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
        </Box>
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <ZoomInIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <ZoomOutIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
        </Box>
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
            flexGrow: 1,
          }}
        >
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <ArrowDropUpIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
          <IconButton>
            <Avatar sx={{ width: size, height: size }}>
              <ArrowDropDownIcon sx={{ fontSize: iconSize }} />
            </Avatar>
          </IconButton>
        </Box>
      </Paper>
    </>
  );
};

type Props = {
  windowSize: [number, number];
  setButtonAreaHeight: React.Dispatch<React.SetStateAction<number>>;
};
