import * as React from "react";

import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

export const TargetDirDialogTitle: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <DialogTitle>{t("targetDirDialog.title")}</DialogTitle>
      <IconButton
        onClick={() => {
          props.setDialogOpen(false);
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
};

type Props = {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
