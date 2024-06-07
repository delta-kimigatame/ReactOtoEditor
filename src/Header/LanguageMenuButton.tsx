import * as React from "react";

import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

/**
 * 言語を切り替えるボタン
 *  */
export const LanguageMenuButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
        sx={{ textTransform: "uppercase" }}
      >
        {props.language}
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        <MenuItem
          onClick={() => {
            props.setLanguage("ja");
            setMenuAnchor(null);
          }}
        >
          {t("language.ja")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.setLanguage("en");
            setMenuAnchor(null);
          }}
        >
          {t("language.en")}
        </MenuItem>
      </Menu>
    </>
  );
};

type Props = {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};
