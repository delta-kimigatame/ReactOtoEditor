import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

export const TargetDirDialogCheckList: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <Box>
        <Typography variant="h6">{t("targetDirDialog.encodeCheck")}</Typography>
        <Divider />
        {props.oto.GetLines()[props.targetDir].map((l) => (
          <>
            <Typography variant="caption">{l}</Typography>
            <Divider />
          </>
        ))}
      </Box>
    </>
  );
};

type Props = {
  targetDir: string | null;
  oto: Oto;
};
