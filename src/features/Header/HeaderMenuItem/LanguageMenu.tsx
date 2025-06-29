import * as React from "react";

import { useTranslation } from "react-i18next";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useCookieStore } from "../../../store/cookieStore";

/**
 * 言語を切り替えるボタン
 * @param props {@link LanguageButtonProps}
 * @returns 言語を切り替えるボタン
 */
export const LanguageMenu: React.FC<LanguageButtonProps> = (props) => {
  const { t } = useTranslation();
  const { language, setLanguage } = useCookieStore();
  /** メニューの表示位置。nullの時は非表示 */
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <MenuItem
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
      >
        <ListItemIcon>
          <Avatar sx={{ width: 24, height: 24, fontSize: 16 }}>
            {language}
          </Avatar>
        </ListItemIcon>
        <ListItemText>{t("menu.changeLanguage")}</ListItemText>
      </MenuItem>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        <MenuItem
          onClick={() => {
            setLanguage("ja");
            setMenuAnchor(null);
            props.setMenuAnchor(null);
          }}
        >
          {t("language.ja")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLanguage("en");
            setMenuAnchor(null);
            props.setMenuAnchor(null);
          }}
        >
          {t("language.en")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            setLanguage("zh");
            setMenuAnchor(null);
            props.setMenuAnchor(null);
          }}
        >
          {t("language.zh")}
        </MenuItem>
      </Menu>
    </>
  );
};

export interface LanguageButtonProps {
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
