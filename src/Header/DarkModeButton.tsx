import * as React from "react";
import { PaletteMode } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";

/**
 * ライトモード・ダークモードを切り替えるbutton
 * @param props {@link DarkModeButtonProps}
 * @returns ライトモード・ダークモードを切り替えるbutton
 */
export const DarkModeButton: React.FC<DarkModeButtonProps> = (props) => {
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

export interface DarkModeButtonProps {
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**ダークモードかライトモードかを変更する */
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
};
