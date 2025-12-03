import * as React from "react";
import { useTranslation } from "react-i18next";

import Typography from "@mui/material/Typography";

import { BasePaper } from "../Common/BasePaper";
import { Box, Divider } from "@mui/material";

/**
 * トップビューに表示する、ショートカットキーの一覧
 * @returns トップビューに表示する、ショートカットキーの一覧
 */
export const ShortcutPaper: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <BasePaper title={t("top.shortcut.title")}>
        <Box sx={{ m: 1, p: 1 }}>
          <Typography variant="subtitle1">
            {t("top.shortcut.changeParam")}
          </Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.offset")}</li>
              <li>{t("top.shortcut.pre")}</li>
              <li>{t("top.shortcut.overlap")}</li>
              <li>{t("top.shortcut.velocity")}</li>
              <li>{t("top.shortcut.blank")}</li>
            </ul>
          </Typography>
          <Divider />
          <Typography variant="subtitle1">{t("top.shortcut.play")}</Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.playBeforePreutter")}</li>
              <li>{t("top.shortcut.prayAfterPreutter")}</li>
              <li>{t("top.shortcut.playMetronome")}</li>
            </ul>
          </Typography>
          <Divider />
          <Typography variant="subtitle1">
            {t("top.shortcut.changeMode")}
          </Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.toggleOverlapLock")}</li>
              <li>{t("top.shortcut.toggleTouchMode")}</li>
            </ul>
          </Typography>
          <Divider />
          <Typography variant="subtitle1">{t("top.shortcut.show")}</Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.showAliasDialog")}</li>
              <li>{t("top.shortcut.showTableDialog")}</li>
            </ul>
          </Typography>
          <Divider />
          <Typography variant="subtitle1">{t("top.shortcut.zoom")}</Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.zoomIn")}</li>
              <li>{t("top.shortcut.zoomOut")}</li>
            </ul>
          </Typography>
          <Divider />
          <Typography variant="subtitle1">{t("top.shortcut.alias")}</Typography>
          <Typography variant="caption">
            <ul>
              <li>{t("top.shortcut.aliasPrev")}</li>
              <li>{t("top.shortcut.aliasNext")}</li>
            </ul>
          </Typography>
        </Box>
      </BasePaper>
    </>
  );
};
