import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { PaletteMode } from "@mui/material";

import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";

import { DarkModeMenu } from "./HeaderMenuItem/DarkModeMenu";
import { LanguageMenu } from "../../features/Header/HeaderMenuItem/LanguageMenu";
import { ColorMenu } from "../../features/Header/HeaderMenuItem/ColorMenu";
import { TargetDirMenu } from "../../features/Header/HeaderMenuItem/TargetDirMenu";
import { DownloadOtoMenu } from "../../features/Header/HeaderMenuItem/DownloadOtoMenu";
import { DownloadZipMenu } from "../../features/Header/HeaderMenuItem/DownloadZipMenu";
import { ShowLogMenu } from "../../features/Header/HeaderMenuItem/ShowLogMenu";
import { HeaderMenuClearCache } from "../../features/Header/HeaderMenuItem/HeaderMenuClearCache";

/**
 * ヘッダメニュー
 * @param props {@link HeaderMenuProps}
 * @returns ヘッダメニュー
 */
export const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  return (
    <>
      <Menu
        anchorEl={props.menuAnchor}
        open={Boolean(props.menuAnchor)}
        onClose={() => {
          props.setMenuAnchor(null);
        }}
      >
        <TargetDirMenu
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
          oto={props.oto}
          setOto={props.setOto}
          readZip={props.readZip}
          setMenuAnchor={props.setMenuAnchor}
          zipFileName={props.zipFileName}
        />
        {props.oto !== null && (
          <>
            <DownloadOtoMenu
              oto={props.oto}
              targetDir={props.targetDir}
              setMenuAnchor={props.setMenuAnchor}
            />
            <DownloadZipMenu
              targetDirs={props.targetDirs}
              readZip={props.readZip}
              oto={props.oto}
              targetDir={props.targetDir}
              setMenuAnchor={props.setMenuAnchor}
              zipFileName={props.zipFileName}
            />
            <Divider />
          </>
        )}
        <LanguageMenu
          setMenuAnchor={props.setMenuAnchor}
        />
        <ColorMenu
          setMenuAnchor={props.setMenuAnchor}
        />
        <DarkModeMenu
          setMenuAnchor={props.setMenuAnchor}
        />
        <Divider />
        <HeaderMenuClearCache setMenuAnchor={props.setMenuAnchor}/>
        <Divider />
        <ShowLogMenu setMenuAnchor={props.setMenuAnchor} />
      </Menu>
    </>
  );
};

export interface HeaderMenuProps {
  /**現在選択されているoto.iniのレコード */
  record: OtoRecord | null;
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
  /** メニューの表示位置。nullの時は非表示 */
  menuAnchor: null | HTMLElement;
  /**メニューの表示制御 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  /** zipのファイル名 */
  zipFileName: string;
}
