import * as React from "react";
import { PaletteMode } from "@mui/material";

import Avatar from "@mui/material/Avatar";
import { specColor } from "../../../config/colors";
import { GetLinearGradient } from "../../../utils/GetLinearGradient";

/**
 * 色設定メニューにサンプルで表示するアイコン
 * @param param0
 * @returns 色設定メニューにサンプルで表示するアイコン
 */
export const ColorAvatar: React.FC<{
  /** ダークモードかライトモードか*/
  mode: PaletteMode;
  /** キャンバスの色設定*/
  color: string;
}> = ({ mode, color }) => {
  return (
    <Avatar
      sx={{
        background: GetLinearGradient(mode, color),
        width: 24,
        height: 24,
      }}
    >
      {" "}
    </Avatar>
  );
};