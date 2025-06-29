
import * as React from "react";
import { PaletteMode } from "@mui/material";

import { useTranslation } from "react-i18next";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import { ColorAvatar } from "./ColorAvatar";

/**
 * 色設定メニューのアイテム
 * @param param0
 * @returns 色設定メニューのアイテム
 */
export const ColorMenuItem: React.FC<{
    /** ダークモードかライトモードか*/
    mode: PaletteMode;
    /** キャンバスの色設定*/
    color: string;
    /**キャンバスの色設定を変更する */
    setColor: React.Dispatch<React.SetStateAction<string>>;
    /**メニューの表示位置。nullの時表示しない */
    setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
    /**親メニューを閉じるために使用 */
    parentSetMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  }> = ({ mode, color, setColor, setMenuAnchor, parentSetMenuAnchor }) => {
    const { t } = useTranslation();
    return (
      <ListItem
        onClick={() => {
          setColor(color);
          setMenuAnchor(null);
          parentSetMenuAnchor(null);
        }}
      >
        <ListItemIcon>
          <ColorAvatar mode={mode} color={color} />
        </ListItemIcon>
        <ListItemText>{t("color." + color)}</ListItemText>
      </ListItem>
    );
  };
  