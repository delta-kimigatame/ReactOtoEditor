import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { PaletteMode } from "@mui/material";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";

import { setting } from "../settings/setting";
import { HeaderMenu } from "./HeaderMenu";

/**
 * ヘッダ
 * @param props {@link HeaderProps}
 * @returns ヘッダ全体
 */
export const Header: React.FC<HeaderProps> = (props) => {
  const { t } = useTranslation();
  /** テキスト表示領域 */
  const [textWidth, setTextWidth] = React.useState<number>(
    props.windowSize[0] - 40 - 24 - 32
  );
  /** 画面サイズが変更されたとき、テキスト表示領域も変更する。 */
  React.useEffect(() => {
    setTextWidth(props.windowSize[0] - 40 - 24 - 32);
  }, [props.windowSize]);
  /** メニューの表示位置。nullの時は非表示 */
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
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
                <img
                  src="./static/logo192.png"
                  alt="logo"
                  style={{ width: 32 }}
                />
              </Avatar>
            </IconButton>
            {props.record === null ? (
              <Typography variant="subtitle2">
                {setting.productName}
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
          <Box sx={{ minWidth: 40 }}>
            <IconButton
              onClick={(e) => {
                setMenuAnchor(e.currentTarget);
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <HeaderMenu
        mode={props.mode}
        setMode={props.setMode}
        color={props.color}
        setColor={props.setColor}
        language={props.language}
        setLanguage={props.setLanguage}
        record={props.record}
        readZip={props.readZip}
        targetDirs={props.targetDirs}
        targetDir={props.targetDir}
        setTargetDir={props.setTargetDir}
        oto={props.oto}
        setOto={props.setOto}
        menuAnchor={menuAnchor}
        setMenuAnchor={setMenuAnchor}
        zipFileName={props.zipFileName}
      />
    </>
  );
};

export interface HeaderProps {
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
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /** zipのファイル名 */
  zipFileName:string
}
