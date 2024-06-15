import * as React from "react";

import { useTranslation } from "react-i18next";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

/**
 * トップビューに表示する、利用規約
 * @returns トップビューに表示する、利用規約
 */
export const RulePaper: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Paper elevation={2} sx={{ m: 1, p: 2 }}>
        <Typography variant="h6">{t("top.rule")}</Typography>
        <Divider />
        <Box sx={{ m: 1, p: 1 }}>
          <Typography variant="body1">{t("top.ruleDescription")}</Typography>
          <Typography variant="caption" color="inherit">
            {t("top.ruleDescription2")}
          </Typography>
          <br />
        </Box>
      </Paper>
    </>
  );
};
