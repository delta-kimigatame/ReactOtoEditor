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
 * ヘッダ
 * @param props {@link Props}
 * @returns ヘッダ全体
 */
export const Header: React.FC<Props> = (props) => {
  /** テキスト表示領域 */
  const [textWidth, setTextWidth] = React.useState<number>(
    props.windowSize[0] - 120 - 24 - 32
  );
  /** 画面サイズが変更されたとき、テキスト表示領域も変更する。 */
  React.useEffect(() => {
    setTextWidth(props.windowSize[0] - 120 - 24 - 32);
  }, [props.windowSize]);
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
                  maxWidth: textWidth,
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

interface Props {
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /**ダークモードかライトモードかを変更する */
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
  /**キャンバスの色設定 */
  color: string;
  /**キャンバスの色設定を変更する */
  setColor: React.Dispatch<React.SetStateAction<string>>;
  /**言語設定 */
  language: string;
  /**言語設定を変更する処理 */
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  /**現在選択されているoto.iniのレコード */
  record: OtoRecord | null;
  /**画面サイズ */
  windowSize: [number, number];
};
