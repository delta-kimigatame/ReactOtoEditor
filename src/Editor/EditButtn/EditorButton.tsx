import * as React from "react";
import { PaletteMode } from "@mui/material";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

export const EditorButton: React.FC<Props> = (props) => {
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

type Props = {
  size: number;
  icon: React.ReactElement;
  title: string;
  background?: string;
  disabled?: boolean;
  onClick: () => void;
  mode: PaletteMode;
};
