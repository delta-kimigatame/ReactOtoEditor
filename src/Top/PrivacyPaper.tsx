import * as React from "react";

import { useTranslation } from "react-i18next";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

/**
 * トップビューに表示する、プライバシーポリシー
 * @returns トップビューに表示する、プライバシーポリシー
 */
export const PrivacyPaper: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Paper elevation={2} sx={{ m: 1, p: 2 }}>
        <Typography variant="h6">{t("top.privacy")}</Typography>
        <Divider />
        <Typography variant="caption">
          <ul>
            <li>{t("top.privacyAnalytics")}</li>
            <li>{t("top.privacyCookie")}</li>
          </ul>
        </Typography>
      </Paper>
    </>
  );
};
