import * as React from "react";
import { PaletteMode } from "@mui/material";

import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { specColor } from "../settings/colors";

/**
 * 表示色を切り替えるボタン
 *  */
export const ColorMenuButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          setMenuAnchor(e.currentTarget);
        }}
      >
        <ColorAvatar mode={props.mode} color={props.color} />
      </IconButton>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
      >
        {Object.keys(specColor).map((c) => (
          <>
            <ColorMenuItem
              mode={props.mode}
              color={c}
              setColor={props.setColor}
              setMenuAnchor={setMenuAnchor}
            />
          </>
        ))}
      </Menu>
    </>
  );
};

type Props = {
  mode: PaletteMode;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

const GetLinearGradient = (mode: PaletteMode, color: string): string => {
  let value = "linear-gradient(to top";
  specColor[color][mode].forEach((c) => {
    value += ",rgb(" + c.r + "," + c.g + "," + c.b + ")";
  });
  value += ")";
  return value;
};

const ColorMenuItem: React.FC<{
  mode: PaletteMode;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}> = ({ mode, color, setColor, setMenuAnchor }) => {
  const { t } = useTranslation();
  return (
    <MenuItem
      onClick={() => {
        setColor(color);
        setMenuAnchor(null);
      }}
    >
      <ListItemIcon>
        <ColorAvatar mode={mode} color={color} />
      </ListItemIcon>
      <ListItemText>{t("color." + color)}</ListItemText>
    </MenuItem>
  );
};

const ColorAvatar: React.FC<{ mode: PaletteMode; color: string }> = ({
  mode,
  color,
}) => {
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
