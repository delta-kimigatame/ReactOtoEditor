import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ内のoto.ini文字化けを確認するエリア
 * @param props {@link TargetDirDialogCheckListProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ内のoto.ini文字化けを確認するエリア
 */
export const TargetDirDialogCheckList: React.FC<TargetDirDialogCheckListProps> = (props) => {
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

export interface TargetDirDialogCheckListProps {
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 仮に読み込んだoto.iniのデータ */
  oto: Oto;
};
