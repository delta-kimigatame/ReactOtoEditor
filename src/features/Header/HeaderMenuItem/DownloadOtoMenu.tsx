import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import DownloadIcon from "@mui/icons-material/Download";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { LOG } from "../../../lib/Logging";
import { useOtoProjectStore } from "../../../store/otoProjectStore";

/**
 * oto.iniをダウンロードするメニュー
 * @param props {@link DownloadOtoMenuProps}
 * @returns oto.iniをダウンロードするメニュー
 */
export const DownloadOtoMenu: React.FC<DownloadOtoMenuProps> = (props) => {
  const { t } = useTranslation();
  const { targetDir,oto } = useOtoProjectStore();
  const OnClick = () => {
    LOG.debug(`oto.iniのダウンロード`, "DownloadOtoMenu");
    Log.gtag("downloadOto");
    const f = oto.OutputOto();
    let url = "";
    f.forEach((file) => {
      if (file.name === targetDir) {
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
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
