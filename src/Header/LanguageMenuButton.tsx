import * as React from "react";

import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";

/**
 * 言語を切り替えるボタン
 *  */
export const LanguageMenuButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton
        color="inherit"
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
        sx={{ textTransform: "uppercase" }}
      >
        <Avatar sx={{ width: 24, height: 24, fontSize:16 }}>
          {props.language}
        </Avatar>
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
