import * as React from "react";
import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのタイトル部分
 * @param props {@link TargetDirDialogTitleProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのタイトル部分
 */
export const TargetDirDialogTitle: React.FC<TargetDirDialogTitleProps> = (
  props
) => {
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

export interface TargetDirDialogTitleProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
