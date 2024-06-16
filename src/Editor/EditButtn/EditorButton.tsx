import * as React from "react";
import { PaletteMode } from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

/**
 * 操作画面のボタンの共通部分
 * @param props {@link EditorButtonProps}
 * @returns 操作画面のボタンの共通部分
 */
export const EditorButton: React.FC<EditorButtonProps> = (props) => {
  return (
    <>
      <Tooltip title={props.title}>
        <IconButton onClick={props.onClick} disabled={props.disabled}>
          <Avatar
            sx={{
              width: props.size,
              height: props.size,
              background: props.background,
              backgroundColor:
                props.mode === "dark"
                  ? props.disabled
                    ? "#757575"
                    : "#bdbdbd"
                  : "#bdbdbd",
              color:
                props.mode === "light"
                  ? props.disabled
                    ? "#d0d0d0"
                    : "#eeeeee"
                  : "",
            }}
          >
            {props.icon}
          </Avatar>
        </IconButton>
      </Tooltip>
    </>
  );
};

export interface EditorButtonProps {
  /** ボタンのサイズ */
  size: number;
  /** アイコンコンポーネント */
  icon: React.ReactElement;
  /** ツールチップに表示するタイトル */
  title: string;
  /** 背景色 */
  background?: string;
  /** 無効化 */
  disabled?: boolean;
  /** クリック時の処理 */
  onClick: () => void;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
};
