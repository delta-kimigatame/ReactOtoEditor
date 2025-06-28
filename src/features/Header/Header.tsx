import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import MenuIcon from "@mui/icons-material/Menu";

import { setting } from "../../config/setting";
import { HeaderMenu } from "../../components/Header/HeaderMenu";
import { useWindowSize } from "../../hooks/useWindowSize";

/**
 * ヘッダ
 * @param props {@link HeaderProps}
 * @returns ヘッダ全体
 */
export const Header: React.FC<HeaderProps> = (props) => {
  const windowSize=useWindowSize();
  /** テキスト表示領域 */
  const textWidth=React.useMemo(()=>windowSize.width - 40 - 24 - 32, [windowSize.width]);
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
        record={props.record}
        targetDir={props.targetDir}
        setTargetDir={props.setTargetDir}
        oto={props.oto}
        setOto={props.setOto}
        menuAnchor={menuAnchor}
        setMenuAnchor={setMenuAnchor}
      />
    </>
  );
};

export interface HeaderProps {
  /**現在選択されているoto.iniのレコード */
  record: OtoRecord | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
}
