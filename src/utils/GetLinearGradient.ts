import { PaletteMode } from "@mui/material";

import { specColor } from "../config/colors";

/**
 * 色設定を受け取り、グラデーション設定用の文字列を返す。
 * @param mode ダークモードかライトモードか
 * @param color キャンバスの色設定
 * @returns グラデーション設定用の文字列
 */
export const GetLinearGradient = (mode: PaletteMode, color: string): string => {
  let value = "linear-gradient(to top";
  specColor[color][mode].forEach((c) => {
    value += ",rgb(" + c.r + "," + c.g + "," + c.b + ")";
  });
  value += ")";
  return value;
};
