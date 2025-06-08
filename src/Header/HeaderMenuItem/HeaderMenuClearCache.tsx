import CachedIcon from "@mui/icons-material/Cached";
import React from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Log } from "../../Lib/Logging";
export const HeaderMenuClearCache: React.FC<HeaderMenuClearCacheProps> = (props) => {
  const { t } = useTranslation();
  const handleClick = () => {
    Log.log("click", "HeaderMenuClearCache");
    Log.log("アプリのキャッシュクリア", "HeaderMenuClearCache");
    clearAppCache();
  };

  const clearAppCache = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      Log.log("swクリア", "HeaderMenuClearCache");
    } else {
      Log.log("sw未登録", "HeaderMenuClearCache");
    }
    const cacheKeys = await caches.keys();
    for (const key of cacheKeys) {
      await caches.delete(key);
      Log.log("キャッシュクリア${key}", "HeaderMenuClearCache");
    }
    Log.log("アプリのキャッシュクリア完了", "HeaderMenuClearCache");
    props.setMenuAnchor(null);
  };
  return (
    <>
    <MenuItem onClick={handleClick}>
      <ListItemIcon>
      <CachedIcon />
      </ListItemIcon>
      <ListItemText>{t("menu.clearAppCache")}</ListItemText>
    </MenuItem>
    </>
  );
};

interface HeaderMenuClearCacheProps{
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}