import * as React from "react";
import { useTranslation } from "react-i18next";

import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useCookieStore } from "../../../store/cookieStore";

/** 線形スペクトログラムとメルスペクトログラムを切り替えるメニュー項目 */
export const SpectrogramDisplayMenu: React.FC<
  SpectrogramDisplayMenuProps
> = (props) => {
  const { t } = useTranslation();
  const { spectrogramDisplayType, setSpectrogramDisplayType } = useCookieStore();
  const nextDisplayType =
    spectrogramDisplayType === "linear" ? "mel" : "linear";

  return (
    <MenuItem
      onClick={() => {
        setSpectrogramDisplayType(nextDisplayType);
        props.setMenuAnchor(null);
      }}
    >
      <ListItemIcon>
        <GraphicEqIcon />
      </ListItemIcon>
      <ListItemText>
        {spectrogramDisplayType === "linear"
          ? t("menu.toMelSpectrogram")
          : t("menu.toLinearSpectrogram")}
      </ListItemText>
    </MenuItem>
  );
};

export interface SpectrogramDisplayMenuProps {
  /** 親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
