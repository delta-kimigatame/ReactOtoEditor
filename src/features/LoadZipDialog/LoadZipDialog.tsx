import * as React from "react";
import JSZip from "jszip";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";

import { LoadZipDialogContent } from "../../components/LoadZipDialog/LoadZipDialogContent";
import { LoadZipDialogTitle } from "../../components/LoadZipDialog/LoadZipDialogTitle";

import { LOG } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * zipを指定した文字コードで解凍する（テスト可能な外部関数）
 * @param file 読み込んだファイル
 * @param encoding 文字コード
 * @param setZipFileName zipファイル名を設定する関数
 * @param setProcessing 処理中状態を設定する関数
 * @param setZipFiles zipファイル一覧を設定する関数
 */
export const LoadZip = (
  file: File,
  encoding: string = "utf-8",
  setZipFileName: (filename: string) => void,
  setProcessing: (processing: boolean) => void,
  setZipFiles: (files: { [key: string]: JSZip.JSZipObject } | null) => void
) => {
  const zip = new JSZip();
  const td = new TextDecoder(encoding);
  LOG.debug(`zip読込。文字コード:${encoding}`, "LoadZipDialog");
  setZipFileName(file.name);
  zip
    .loadAsync(file, {
      decodeFileName: (fileNameBinary: Uint8Array) =>
        td.decode(fileNameBinary),
    })
    .then((z) => {
      setProcessing(false);
      setZipFiles(z.files);
      LOG.gtag("loadzip");
      LOG.debug(`zip読込完了`, "LoadZipDialog");
    });
};

/**
 * zip読込待ちダイアログ \
 * ファイル名の一覧を表示し、必要に応じて読込文字コードを変更する機能を有する。
 * @param props {@link LoadZipDialogProps}
 * @returns zip読込待ちダイアログ
 */
export const LoadZipDialog: React.FC<LoadZipDialogProps> = (props) => {
  const {setZipFileName}=useOtoProjectStore()
  /** 読込待ち判定用 */
  const [processing, setProcessing] = React.useState<boolean>(false);
  /** zipファイル。文字コードを確認するために仮で展開するため、親コンポーネントとは独立してデータを保持する。 */
  const [zipFiles, setZipFiles] = React.useState<{
    [key: string]: JSZip.JSZipObject;
  } | null>(null);
  /** zipのファイル名を解釈するための文字コード */
  const [encoding, setEncoding] = React.useState<string>("utf-8");

  /**
   * zipを指定した文字コードで解凍する（内部関数）
   * @param file 読み込んだファイル
   * @param encoding 文字コード
   */
  const LoadZip_ = (file: File, encoding: string = "utf-8") => {
    LoadZip(file, encoding, setZipFileName, setProcessing, setZipFiles);
  };

  /** ファイルが変更された際の処理。 */
  React.useEffect(() => {
    if (props.file === null) {
      props.setDialogOpen(false);
    } else {
      setProcessing(true);
      LoadZip_(props.file);
    }
  }, [props.file]);

  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullScreen
      >
        <LoadZipDialogTitle setDialogOpen={props.setDialogOpen} />
        <Divider />
        <LoadZipDialogContent
          file={props.file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={LoadZip_}
          setDialogOpen={props.setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={props.setZipFiles}
        />
      </Dialog>
    </>
  );
};

export interface LoadZipDialogProps {
  /** 読み込んだファイル */
  file: File | null;
  /** ダイアログを表示するか否か */
  dialogOpen: boolean;
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** zipファイルを設定する。読込完了を上位コンポーネントに返すために使用 */
  setZipFiles: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
}
