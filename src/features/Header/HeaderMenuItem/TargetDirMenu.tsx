import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import RuleFolderIcon from "@mui/icons-material/RuleFolder";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import { TargetDirDialog } from "../../../components/TargetDirDialog/TargetDirDialog";
import { Log } from "../../../lib/Logging";
import { GetStorageOto, SaveStorageOto } from "../../../services/StorageOto";
import { useOtoProjectStore } from "../../../store/otoProjectStore";

/**
 * フォルダ変更ダイアログを表示するボタン
 * @param props {@link TargetDirMenuProps}
 * @returns フォルダ変更ダイアログを表示するボタン
 */
export const TargetDirMenu: React.FC<TargetDirMenuProps> = (props) => {
  const { zipFileName, targetDirs, targetDir } = useOtoProjectStore();
  const { t } = useTranslation();
  /** 原音設定対象ディレクトリを選択するためのダイアログ表示設定 */
  const [targetDirDialogOpen, setTargetDirDialogOpen] = React.useState<
    boolean | null
  >(null);

  React.useEffect(() => {
    if (targetDirDialogOpen === false) {
      props.setMenuAnchor(null);
    }
  }, [targetDirDialogOpen]);

  /** 編集中のoto.iniをlocalstorageに書き込んでTargetDirDialogを開く */
  const OnMenuClick = () => {
    const storagedOto: {} = GetStorageOto();
    SaveStorageOto(storagedOto, props.oto, zipFileName, targetDir);
    Log.log(`localstorageに保存`, "TargetDirMenu");
    setTargetDirDialogOpen(true);
  };

  return (
    <>
      {targetDirs !== null && targetDirs.length !== 1 && (
        <>
          <MenuItem onClick={OnMenuClick}>
            <ListItemIcon>
              <RuleFolderIcon />
            </ListItemIcon>
            <ListItemText>{t("menu.changeTargetDir")}</ListItemText>
          </MenuItem>
          <Divider />
          <TargetDirDialog
            dialogOpen={targetDirDialogOpen}
            setDialogOpen={setTargetDirDialogOpen}
            oto={props.oto}
            setOto={props.setOto}
          />
        </>
      )}
    </>
  );
};

export interface TargetDirMenuProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}
