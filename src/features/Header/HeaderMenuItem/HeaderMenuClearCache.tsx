import CachedIcon from "@mui/icons-material/Cached";
import React from "react";
import { useTranslation } from "react-i18next";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { LOG } from "../../../lib/Logging";
export const HeaderMenuClearCache: React.FC<HeaderMenuClearCacheProps> = (props) => {
  const { t } = useTranslation();
  const handleClick = () => {
    LOG.debug("click", "HeaderMenuClearCache");
    LOG.debug("アプリのキャッシュクリア", "HeaderMenuClearCache");
    clearAppCache();
  };

  const clearAppCache = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      LOG.debug("swクリア", "HeaderMenuClearCache");
    } else {
      LOG.debug("sw未登録", "HeaderMenuClearCache");
    }
    const cacheKeys = await caches.keys();
    for (const key of cacheKeys) {
      await caches.delete(key);
      LOG.debug("キャッシュクリア${key}", "HeaderMenuClearCache");
    }
    LOG.debug("アプリのキャッシュクリア完了", "HeaderMenuClearCache");
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