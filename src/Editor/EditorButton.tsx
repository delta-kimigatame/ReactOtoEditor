import * as React from "react";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

export const EditorButton: React.FC<Props> = (props) => {
  return (
    <>
      <Tooltip title={props.title}>
        <IconButton>
          <Avatar
            sx={{
              width: props.size,
              height: props.size,
              background: props.background,
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
  onClick: () => void;
};
