import * as React from "react";
import { PaletteMode } from "@mui/material";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { setting } from "../settings/setting";
import { DarkModeButton } from "./DarkModeButton";
import { LanguageMenuButton } from "./LanguageMenuButton";
import { ColorMenuButton } from "./ColorMenuButton";

/**
 * ヘッダ。
 *  */
export const Header: React.FC<Props> = (props) => {
  return (
    <>
      <AppBar position="relative">
        <Toolbar sx={{ justifyContent: "space-between",minHeight:"40!important" }}>
          <Button variant="text" color="inherit">
            <Typography variant="subtitle2">{setting.product_name}</Typography>
          </Button>
          <Box>
            <LanguageMenuButton
              language={props.language}
              setLanguage={props.setLanguage}
            />
            <ColorMenuButton
              mode={props.mode}
              color={props.color}
              setColor={props.setColor}
            />
            <DarkModeButton mode={props.mode} setMode={props.setMode} />
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

type Props = {
  mode: PaletteMode;
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
};
