import * as React from "react";
import JSZip from "jszip";
import * as iconv from "iconv-lite";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { FullWidthButton } from "../Common/FullWidthButton";

/**
 * zipをダウンロードするダイアログ
 * @param props {@link DownloadZipDialogTitleProps}
 * @returns zipをダウンロードするダイアログ
 */
export const DownloadZipDialogTitle: React.FC<DownloadZipDialogTitleProps> = (
  props
) => {
  /** zipの書き出し中 */
  const [progress, setProgress] = React.useState<boolean>(false);
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
      if (props.targetList[i] === 0) {
        /** 原音設定中のデータ */
        const f = new File(
          [iconv.encode(props.oto.GetLines()[td].join("\r\n"), "Windows-31j")],
          "oto.ini",
          { type: "text/plane;charset=shift-jis" }
        );
        newZip.file(td + "/oto.ini", f);
      } else if (props.targetList[i] === 1) {
        /** 保存されたデータ */
        const f = new File(
          [iconv.encode(props.storagedOto[td]["oto"], "Windows-31j")],
          "oto.ini",
          { type: "text/plane;charset=shift-jis" }
        );
        newZip.file(td + "/oto.ini", f);
      } else {
        /** 書き出ししない場合 */
        if (Object.keys(newZip.files).includes(td + "/oto.ini")) {
          newZip.remove(td + "/oto.ini");
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
    props.setDialogOpen(false);
    props.setMenuAnchor(null);
  };

  const { t } = useTranslation();
  return (
    <>
      <DialogTitle>
        <FullWidthButton onClick={OnDownloadClick} disabled={progress}>
          {progress ? <CircularProgress /> : t("menu.zipDownload")}
        </FullWidthButton>
        <Divider />
      </DialogTitle>
      <IconButton
        onClick={() => {
          props.setDialogOpen(false);
        }}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    </>
  );
};

export interface DownloadZipDialogTitleProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  /** zipのファイル名 */
  zipFileName: string;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 保存されたoto.ini */
  storagedOto: {};
  /** 書き出すotoの対象リスト */
  targetList: Array<number> | null;
  /** 書き出すotoの対象リストを更新する処理 */
  setTargetList: React.Dispatch<React.SetStateAction<Array<number> | null>>;
}
