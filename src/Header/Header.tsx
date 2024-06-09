import * as React from "react";
import { PaletteMode } from "@mui/material";
import OtoRecord from "utauoto/dist/OtoRecord";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

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
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: "40!important" }}
        >
          <Box
            sx={{ display: "flex", flexWrap: "nowrap", alignItems: "center" }}
          >
            <IconButton>
              <Avatar sx={{ width: 24, height: 24 }}>
                {setting.product_name.substring(0, 1)}
              </Avatar>
            </IconButton>
            {props.record === null ? (
              <Typography variant="subtitle2">
                {setting.product_name}
              </Typography>
            ) : (
              <Box
                sx={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  maxWidth: props.windowSize[0] - 120 - 24 - 32,
                }}
              >
                <Typography variant="caption">
                  {"(" +
                    props.record.alias +
                    ")" +
                    props.record.filename.replace(".wav", "")}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ minWidth: 120 }}>
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
  record: OtoRecord | null;
  windowSize: [number, number];
};
