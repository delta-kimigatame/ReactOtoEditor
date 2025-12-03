import * as React from "react";
import { useTranslation } from "react-i18next";
import NotesIcon from "@mui/icons-material/Notes";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { LOG } from "../../../lib/Logging";
import { ShowLogDialog } from "../../ShowLogDialog/ShowLogDialog";

export interface ShowLogMenuProps {
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}

/**
 * logを表示するメニュー
 * @param props {@link ShowLogMenuProps}
 */
export const ShowLogMenu: React.FC<ShowLogMenuProps> = (props) => {
  /** ダイアログ表示設定 */
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

  /**
   * メニューをクリックした際の処理。ダイアログを開く
   */
  const OnMenuClick = () => {
    LOG.debug(`ログ表示`, "ShowLogMenu");
    setDialogOpen(true);
  };

  const { t } = useTranslation();

  return (
    <>
      <MenuItem onClick={OnMenuClick}>
        <ListItemIcon>
          <NotesIcon />
        </ListItemIcon>
        <ListItemText>{t("menu.showLog")}</ListItemText>
      </MenuItem>
      <ShowLogDialog
        open={dialogOpen}
        onClose={() => {
          props.setMenuAnchor(null);
          setDialogOpen(false);
        }}
        setMenuAnchor={props.setMenuAnchor}
      />
    </>
  );
};