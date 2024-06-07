import * as React from "react";
import { PaletteMode } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";

/**
 * ライトモード・ダークモードを切り替えるボタンを有する。
 *  */
export const DarkModeButton: React.FC<Props> = (props) => {
  return (
    <>
      <IconButton
        onClick={() => {
          props.setMode(props.mode === "dark" ? "light" : "dark");
        }}
      >
        {props.mode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
      </IconButton>
    </>
  );
};

type Props = {
  mode: PaletteMode;
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
};
