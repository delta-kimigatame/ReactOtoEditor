import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { TargetDirDialogSelectDir } from "./TargetDirDialogSelectDir";
import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";

/**
 * 原音設定対象ディレクトリを選択するためのダイアログのボディ
 * @param props {@link TargetDirDialogContentProps}
 * @returns 原音設定対象ディレクトリを選択するためのダイアログのボディ
 */
export const TargetDirDialogContent: React.FC<TargetDirDialogContentProps> = (props) => {
  const { t } = useTranslation();
  /** oto.iniがディレクトリ内に存在するか否か */
  const [nothingOto, setNothingOto] = React.useState<boolean>(false);
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOto] = React.useState<Oto | null>(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");

  /** `props.targetDir`が変更されたとき、oto.iniの読込を行う。 */
  React.useEffect(() => {
    if (props.targetDir === null) return;
    if (props.readZip === null) return;
    setNothingOto(false);
    LoadOto();
  }, [props.targetDir]);

  /**
   * oto.iniを読み込む。
   * @param encoding_ 文字コード
   */
  const LoadOto = (encoding_: string = "SJIS") => {
    if (Object.keys(props.readZip).includes(props.targetDir + "/oto.ini")) {
      props.readZip[props.targetDir + "/oto.ini"]
        .async("arraybuffer")
        .then((result) => {
          const oto = new Oto();
          oto
            .InputOtoAsync(
              props.targetDir,
              new Blob([result], { type: "text/plain" }),
              encoding_
            )
            .then(() => {
              setOto(oto);
            });
        });
    } else {
      setNothingOto(true);
    }
  };

  return (
    <>
      <DialogContent>
        <TargetDirDialogSelectDir
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
        />
        <Divider />
        <Box sx={{ p: 1 }}>
          {nothingOto ? (
            <>
              <Typography>{t("targetDirDialog.NothingOto")}</Typography>
            </>
          ) : oto !== null ? (
            <>
              <TargetDirDialogButtonArea
                oto={oto}
                setOto={props.setOto}
                setOtoTemp={setOto}
                setDialogOpen={props.setDialogOpen}
                LoadOto={LoadOto}
                encoding={encoding}
                setEncoding={setEncoding}
              />
              <Divider />
              <TargetDirDialogCheckList oto={oto} targetDir={props.targetDir} />
            </>
          ) :props.targetDir!==null && (
            <>
              <Box sx={{ textAlign: "center", minHeight: 150 }}>
                <CircularProgress size={100} sx={{ maxWidth: "100%" }} />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </>
  );
};

export interface TargetDirDialogContentProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** zip内のwavファイルがあるディレクトリの一覧 */
  targetDirs: Array<string> | null;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 現在原音設定の対象になっているディレクトリを変更する処理 */
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  /** 読み込んだzipのデータ */
  readZip: { [key: string]: JSZip.JSZipObject } | null;
};
