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

import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { LOG } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";
import { ZipExtract } from "../../utils/ZipExtract";

/**
 * zipをダウンロードするダイアログ
 * @param props {@link DownloadZipDialogTitleProps}
 * @returns zipをダウンロードするダイアログ
 */
export const DownloadZipDialogTitle: React.FC<DownloadZipDialogTitleProps> = (
  props
) => {
  const { zipFileName, readZip, targetDirs, oto } = useOtoProjectStore();
  /** zipの書き出し中 */
  const [progress, setProgress] = React.useState<boolean>(false);
  /**
   * ダウンロードボタンをクリックした際の処理
   */
  const OnDownloadClick = async () => {
    setProgress(true);
    const newZip = new JSZip();
    LOG.debug("zipの生成", "DownloadZipDialogTitle");

    try {
      const extractedZip = await ZipExtract(readZip, 0, newZip);
      const updatedZip = await AddOtoToZip(
        extractedZip,
        targetDirs,
        props.targetList,
        props.storagedOto,
        oto
      );
      await DownloadZip(updatedZip);
    } catch (error) {
      LOG.error("ZIP生成中にエラーが発生しました", "DownloadZipDialogTitle");
      setProgress(false);
    }
  };

  /**
   * 完成したzipをダウンロードする。
   * @param newZip ダウンロードするzip
   */
  const DownloadZip = async (newZip: JSZip): Promise<void> => {
    const zipData = await newZip.generateAsync({ type: "uint8array" });
    const zipFile = new Blob([zipData], {
      type: "application/zip",
    });
    const url = URL.createObjectURL(zipFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = zipFileName;
    LOG.debug(`zipダウンロード`, "DownloadZipDialogTitle");
    LOG.gtag("downloadZip");
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
  /**親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 保存されたoto.ini */
  storagedOto: {};
  /** 書き出すotoの対象リスト */
  targetList: Array<number> | null;
  /** 書き出すotoの対象リストを更新する処理 */
  setTargetList: React.Dispatch<React.SetStateAction<Array<number> | null>>;
}

/**
 * targetListに基づき、oto.ini入りのzipを作成する。
 * @param newZip 新しく生成するzip。読み込み時のoto.iniが入っている。
 * @param targetDirs 書き出し対象のディレクトリリスト
 * @param targetList 書き出し対象のリスト (0: 現在のデータ, 1: 保存されたデータ, 2: 書き出さない)
 * @param storagedOto 保存されたoto.iniのデータ
 * @param oto Otoインスタンス
 * @returns 更新されたzipオブジェクト
 */
export const AddOtoToZip = async (
  newZip: JSZip,
  targetDirs: string[],
  targetList: Array<number>,
  storagedOto: { [key: string]: { oto: string } },
  oto: Oto
): Promise<JSZip> => {
  for (const [i, td] of targetDirs.entries()) {
    if (targetList[i] === 0) {
      /** 原音設定中のデータ */
      const f = new File(
        [iconv.encode(oto.GetLines()[td].join("\r\n"), "Windows-31j")],
        "oto.ini",
        { type: "text/plane;charset=shift-jis" }
      );
      LOG.debug(`編集中データの保存:${td + "/oto.ini"}`, "AddOtoToZip");
      newZip.file(td + "/oto.ini", f);
    } else if (targetList[i] === 1) {
      /** 保存されたデータ */
      const f = new File(
        [iconv.encode(storagedOto[td]["oto"], "Windows-31j")],
        "oto.ini",
        { type: "text/plane;charset=shift-jis" }
      );
      LOG.debug(`履歴から保存:${td + "/oto.ini"}`, "AddOtoToZip");
      newZip.file(td + "/oto.ini", f);
    } else {
      /** 書き出ししない場合 */
      if (Object.keys(newZip.files).includes(td + "/oto.ini")) {
        LOG.debug(`削除:${td + "/oto.ini"}`, "AddOtoToZip");
        newZip.remove(td + "/oto.ini");
      }
    }
  }
  return newZip;
};
