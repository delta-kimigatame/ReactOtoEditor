import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import FolderZipIcon from "@mui/icons-material/FolderZip";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import { DownloadZipDialog } from "../../DownloadZipDialog/DownloadZipDialog";
import { Log } from "../../lib/Logging";
import { GetStorageOto } from "../../services/StorageOto";

/**
 * zipをダウンロードするメニュー
 * @param props {@link DownloadZipMenuProps}
 * @returns zipをダウンロードするメニュー
 */
export const DownloadZipMenu: React.FC<DownloadZipMenuProps> = (props) => {
  /** ダイアログ表示設定 */
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  /** 保存されたoto.ini */
  const [storagedOto, setStoragedOto] = React.useState<{}>(false);
  /** 書き出すotoの対象リスト */
  const [targetList, setTargetList] = React.useState<Array<number> | null>(
    null
  );

  /**
   * メニューをクリックした際の処理。ダイアログを開く
   */
  const OnMenuClick = () => {
    Log.log(`zipダウンロード準備`, "DownloadZipMenu");
    const storagedOtoTemp: {} = GetStorageOto();
    if (!(props.zipFileName in storagedOtoTemp)) {
      setStoragedOto({});
    } else {
      setStoragedOto(storagedOtoTemp[props.zipFileName]);
    }
    const targetList_: Array<number> = [];
    props.targetDirs.forEach((td) => {
      if (td === props.targetDir) {
        Log.log(`編集中フォルダ:${td}`, "DownloadZipMenu");
        targetList_.push(0);
      } else if (td in storagedOtoTemp[props.zipFileName]) {
        Log.log(`履歴有:${td}`, "DownloadZipMenu");
        targetList_.push(1);
      } else if (Object.keys(props.readZip).includes(td + "/oto.ini")) {
        Log.log(`元zip内に有:${td}`, "DownloadZipMenu");
        targetList_.push(2);
      } else {
        targetList_.push(3);
      }
    });
    setTargetList(targetList_);
    setDialogOpen(true);
  };

  const { t } = useTranslation();
  return (
    <>
      <MenuItem onClick={OnMenuClick}>
        <ListItemIcon>
          <FolderZipIcon />
        </ListItemIcon>
        <ListItemText>{t("menu.zipDownload")}</ListItemText>
      </MenuItem>
      <DownloadZipDialog
        targetDirs={props.targetDirs}
        readZip={props.readZip}
        oto={props.oto}
        targetDir={props.targetDir}
        setMenuAnchor={props.setMenuAnchor}
        zipFileName={props.zipFileName}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        storagedOto={storagedOto}
        targetList={targetList}
        setTargetList={setTargetList}
      />
    </>
  );
};

export interface DownloadZipMenuProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  /** zipのファイル名 */
  zipFileName: string;
}
