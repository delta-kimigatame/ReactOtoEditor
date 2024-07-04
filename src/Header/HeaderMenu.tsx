import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { PaletteMode } from "@mui/material";
import OtoRecord from "utauoto/dist/OtoRecord";
import { useTranslation } from "react-i18next";

import Menu from "@mui/material/Menu";
import Divider from "@mui/material/Divider";

import { DarkModeMenu } from "./HeaderMenuItem/DarkModeMenu";
import { LanguageMenu } from "./HeaderMenuItem/LanguageMenu";
import { ColorMenu } from "./HeaderMenuItem/ColorMenu";
import { TargetDirMenu } from "./HeaderMenuItem/TargetDirMenu";
import { DownloadOtoMenu } from "./HeaderMenuItem/DownloadOtoMenu";
import { DownloadZipMenu } from "./HeaderMenuItem/DownloadZipMenu";

/**
 * ヘッダメニュー
 * @param props {@link HeaderMenuProps}
 * @returns ヘッダメニュー
 */
export const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
  const { t } = useTranslation();

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
          language={props.language}
          setLanguage={props.setLanguage}
          setMenuAnchor={props.setMenuAnchor}
        />
        <ColorMenu
          mode={props.mode}
          color={props.color}
          setColor={props.setColor}
          setMenuAnchor={props.setMenuAnchor}
        />
        <DarkModeMenu
          mode={props.mode}
          setMode={props.setMode}
          setMenuAnchor={props.setMenuAnchor}
        />
      </Menu>
    </>
  );
};

export interface HeaderMenuProps {
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
  zipFileName:string
}
