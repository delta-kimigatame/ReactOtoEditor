import * as React from "react";

import { useTranslation } from "react-i18next";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import { specColor } from "../../../config/colors";
import { useCookieStore } from "../../../store/cookieStore";
import { useThemeMode } from "../../../hooks/useThemeMode";
import { ColorAvatar } from "../../../components/Header/HeaderMenuItem/ColorAvatar";
import { ColorMenuItem } from "../../../components/Header/HeaderMenuItem/ColorMenuItem";

/**
 * 表示色を切り替えるボタン
 * @param props {@link ColorMenuProps}
 * @returns 表示色を切り替えるボタン
 */
export const ColorMenu: React.FC<ColorMenuProps> = (props) => {
  const { t } = useTranslation();
  const {colorTheme,setColorTheme} = useCookieStore();
  const mode=useThemeMode()
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <MenuItem
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
      >
        <ListItemIcon>
          <ColorAvatar mode={mode} color={colorTheme} />
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
              mode={mode}
              color={c}
              setColor={setColorTheme}
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
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
