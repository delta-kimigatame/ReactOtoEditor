import * as React from "react";
import { PaletteMode } from "@mui/material";

import { useTranslation } from "react-i18next";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import { specColor } from "../../../config/colors";

/**
 * 表示色を切り替えるボタン
 * @param props {@link ColorMenuProps}
 * @returns 表示色を切り替えるボタン
 */
export const ColorMenu: React.FC<ColorMenuProps> = (props) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <MenuItem
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
      >
        <ListItemIcon>
          <ColorAvatar mode={props.mode} color={props.color} />
        </ListItemIcon>
        <ListItemText>{t("menu.changeColor")}</ListItemText>
      </MenuItem>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        {Object.keys(specColor).map((c) => (
          <React.Fragment key={"color_menu_" + c}>
            <ColorMenuItem
              mode={props.mode}
              color={c}
              setColor={props.setColor}
              setMenuAnchor={setMenuAnchor}
              parentSetMenuAnchor={props.setMenuAnchor}
            />
          </React.Fragment>
        ))}
      </Menu>
    </>
  );
};

export interface ColorMenuProps {
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**キャンバスの色設定 */
  color: string;
  /**キャンバスの色設定を変更する */
  setColor: React.Dispatch<React.SetStateAction<string>>;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}

/**
 * 色設定を受け取り、グラデーション設定用の文字列を返す。
 * @param mode ダークモードかライトモードか
 * @param color キャンバスの色設定
 * @returns グラデーション設定用の文字列
 */
export const GetLinearGradient = (mode: PaletteMode, color: string): string => {
  let value = "linear-gradient(to top";
  specColor[color][mode].forEach((c) => {
    value += ",rgb(" + c.r + "," + c.g + "," + c.b + ")";
  });
  value += ")";
  return value;
};

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

/**
 * 色設定メニューにサンプルで表示するアイコン
 * @param param0
 * @returns 色設定メニューにサンプルで表示するアイコン
 */
export const ColorAvatar: React.FC<{
  /** ダークモードかライトモードか*/
  mode: PaletteMode;
  /** キャンバスの色設定*/
  color: string;
}> = ({ mode, color }) => {
  return (
    <Avatar
      sx={{
        background: GetLinearGradient(mode, color),
        width: 24,
        height: 24,
      }}
    >
      {" "}
    </Avatar>
  );
};
