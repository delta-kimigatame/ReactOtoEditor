import * as React from "react";
import { PaletteMode } from "@mui/material";
import { useTranslation } from "react-i18next";

import ModeNightIcon from "@mui/icons-material/ModeNight";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useCookieStore } from "../../../store/cookieStore";

/**
 * ライトモード・ダークモードを切り替えるbutton
 * @param props {@link DarkModeButtonProps}
 * @returns ライトモード・ダークモードを切り替えるbutton
 */
export const DarkModeMenu: React.FC<DarkModeButtonProps> = (props) => {
  const { t } = useTranslation();
  const {mode,setMode}=useCookieStore()
  return (
    <>
      <MenuItem
        onClick={() => {
          setMode(mode === "dark" ? "light" : "dark");
          props.setMenuAnchor(null)
        }}
      >
        <ListItemIcon>
          {mode === "dark" ? <LightModeIcon /> : <ModeNightIcon />}
        </ListItemIcon>
        <ListItemText>
          {mode === "dark" ? t("menu.toLightMode"): t("menu.toDarkMode")}
        </ListItemText>
      </MenuItem>
    </>
  );
};

export interface DarkModeButtonProps {
  /**親メニューを閉じるために使用 */
  setMenuAnchor:React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
