import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import FolderZipIcon from "@mui/icons-material/FolderZip";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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

  const OnMenuClick = () => {
    const storagedOto_: string | null = localStorage.getItem("oto");
    const storagedOtoTemp =
      storagedOto_ === null ? {} : JSON.parse(storagedOto_);
    if (!(props.zipFileName in storagedOtoTemp)) {
      setStoragedOto({});
    } else {
      setStoragedOto(storagedOtoTemp[props.zipFileName]);
    }
    const targetList_: Array<number> = [];
    props.targetDirs.forEach((td) => {
      if (td === props.targetDir) {
        targetList_.push(0);
      } else if (td in storagedOtoTemp[props.zipFileName]) {
        targetList_.push(1);
      } else if (Object.keys(props.readZip).includes(td + "/oto.ini")) {
        targetList_.push(2);
      } else {
        targetList_.push(3);
      }
    });
    setTargetList(targetList_);
    setDialogOpen(true);
  };

  const OnSelectChange = (e: SelectChangeEvent<number>, i: number) => {
    const targetList_ = targetList.slice();
    targetList_[i] = e.target.value as number;
    setTargetList(targetList_);
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
      <Dialog
        onClose={() => {
          setDialogOpen(false);
        }}
        open={dialogOpen}
        fullScreen
      >
        <DialogTitle>
          <Button
            fullWidth
            variant="contained"
            sx={{ m: 1 }}
            size="large"
            color="inherit"
          >
            {t("menu.zipDownload")}
          </Button>
          <Divider />
        </DialogTitle>
        <IconButton
          onClick={() => {
            setDialogOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          {targetList !== null &&
            props.targetDirs.map((td, i) => (
              <>
                <FormControl fullWidth sx={{ m: 1 }}>
                  <InputLabel>{td}</InputLabel>
                  <Select
                    label={"td_" + i}
                    variant="filled"
                    color="primary"
                    value={targetList[i]}
                    onChange={(e) => {
                      OnSelectChange(e, i);
                    }}
                  >
                    {td === props.targetDir && (
                      <MenuItem value={0}>
                        {t("downloadZipDialog.current")}
                      </MenuItem>
                    )}
                    {td in storagedOto && (
                      <MenuItem value={1}>
                        {t("downloadZipDialog.storaged")}{" "}
                        {storagedOto[td]["update_date"]}
                      </MenuItem>
                    )}
                    {Object.keys(props.readZip).includes(td + "/oto.ini") && (
                      <MenuItem value={2}>
                        {t("downloadZipDialog.readed")}
                      </MenuItem>
                    )}
                    <MenuItem value={3}>{t("downloadZipDialog.none")}</MenuItem>
                  </Select>
                </FormControl>
              </>
            ))}
        </DialogContent>
      </Dialog>
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
