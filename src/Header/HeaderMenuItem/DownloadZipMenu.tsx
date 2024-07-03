import * as React from "react";
import JSZip from "jszip";
import * as iconv from "iconv-lite";
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
  /** zipの書き出し中 */
  const [progress, setProgress] = React.useState<{}>(false);
  /** 書き出すotoの対象リスト */
  const [targetList, setTargetList] = React.useState<Array<number> | null>(
    null
  );

  /**
   * メニューをクリックした際の処理。ダイアログを開く
   */
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

  /**
   * セレクトボックスを変更した際の処理
   * @param e イベント
   * @param i インデックス
   */
  const OnSelectChange = (e: SelectChangeEvent<number>, i: number) => {
    const targetList_ = targetList.slice();
    targetList_[i] = e.target.value as number;
    setTargetList(targetList_);
  };

  /**
   * ダウンロードボタンをクリックした際の処理
   */
  const OnDownloadClick = () => {
    setProgress(true);
    const newZip = new JSZip();
    ZipExtract(props.readZip, 0, newZip);
  };

  /**
   * zipファイルを再帰呼出しで生成する。
   * @param files zip内のファイル一覧
   * @param index 読み込むファイルのインデックス
   * @param newZip 新しく生成するzip
   */
  const ZipExtract = (
    files: { [key: string]: JSZip.JSZipObject },
    index: number,
    newZip: JSZip
  ) => {
    const k = Object.keys(files)[index];
    files[k].async("arraybuffer").then((result) => {
      newZip.file(k, result);
      if (index < Object.keys(files).length - 1) {
        ZipExtract(files, index + 1, newZip);
      } else {
        ZipedOto(newZip);
      }
    });
  };

  /**
   * targetListに基づき、oto.ini入りのzipを作成する。
   * @param newZip 新しく生成するzip。読み込み時のoto.iniが入っている。
   */
  const ZipedOto = async (newZip: JSZip) => {
    const res = await props.targetDirs.forEach(async (td, i) => {
      if (targetList[i] === 0) {
        /** 原音設定中のデータ */
        const f = new File(
          [iconv.encode(props.oto.GetLines()[td].join("\r\n"), "Windows-31j")],
          "oto.ini",
          { type: "text/plane;charset=shift-jis" }
        );
        newZip.file(td + "/oto.ini", f);
      } else if (targetList[i] === 1) {
        /** 保存されたデータ */
        const f = new File(
          [iconv.encode(storagedOto[td]["oto"], "Windows-31j")],
          "oto.ini",
          { type: "text/plane;charset=shift-jis" }
        );
        newZip.file(td + "/oto.ini", f);
      } else {
        /** 書き出ししない場合 */
        if (Object.keys(newZip).includes(td + "/oto.ini")) {
          newZip.file(td + "/oto.ini", "").remove(td + "/oto.ini");
        }
      }
    });
    const zipData = await newZip.generateAsync({ type: "uint8array" });
    const zipFile = new Blob([zipData], {
      type: "application/zip",
    });
    const url = URL.createObjectURL(zipFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = props.zipFileName;
    a.click();
    setProgress(false);
    setDialogOpen(false);
    props.setMenuAnchor(null);
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
            onClick={OnDownloadClick}
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
