import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import DownloadIcon from "@mui/icons-material/Download";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Log } from "../../Lib/Logging";

/**
 * oto.iniをダウンロードするメニュー
 * @param props {@link DownloadOtoMenuProps}
 * @returns oto.iniをダウンロードするメニュー
 */
export const DownloadOtoMenu: React.FC<DownloadOtoMenuProps> = (props) => {
  const { t } = useTranslation();
  const OnClick = () => {
    Log.log(`oto.iniのダウンロード`, "DownloadOtoMenu");
    const f = props.oto.OutputOto();
    let url = "";
    f.forEach((file) => {
      if (file.name === props.targetDir) {
        url = URL.createObjectURL(file);
      }
    });
    const a = document.createElement("a");
    a.href = url;
    a.download = "oto.ini";
    a.click();
    props.setMenuAnchor(null);
  };
  return (
    <>
      <MenuItem onClick={OnClick}>
        <ListItemIcon>
          <DownloadIcon />
        </ListItemIcon>
        <ListItemText>{t("menu.otoDownload")}</ListItemText>
      </MenuItem>
    </>
  );
};

export interface DownloadOtoMenuProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
