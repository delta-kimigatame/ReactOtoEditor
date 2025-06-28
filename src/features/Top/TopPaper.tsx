import * as React from "react";
import JSZip from "jszip";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import { LoadZipDialog } from "../LoadZipDialog/LoadZipDialog";
import { BasePaper } from "../../components/Common/BasePaper";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { setting } from "../../config/setting";

import { Log } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * トップビューに表示する、zipを読み込むボタンなどを含むPaper
 * @param props {@link TopPaperProps}
 * @returns トップビューに表示する、zipを読み込むボタンなどを含むPaper
 */
export const TopPaper: React.FC<TopPaperProps> = (props) => {
  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);
  const { readZip,setReadZip } = useOtoProjectStore();
  const { t } = useTranslation();
  /** 読込中判定 */
  const [processing, setProcessing] = React.useState<boolean>(false);
  /** ダイアログを開く判定 */
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  /** 読み込んだファイル */
  const [readFile, setReadFile] = React.useState<File | null>(null);

  /**
   * inputのファイルが変更した際のイベント \
   * nullやファイル数が0の時は何もせず終了する。 \
   * ファイルが含まれている場合、1つ目のファイルを`readFile`に代入する。
   * @param e
   */
  const OnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    setProcessing(true);
    setReadFile(e.target.files[0]);
    setDialogOpen(true);
    Log.log(`ファイル読み込み。${e.target.files[0].name}`, "TOPPaper");
  };

  /**
   * ボタンをクリックした際の処理 \
   * 隠し要素であるinputのクリックイベントを発火する。
   */
  const OnButtonClick = () => {
    setProcessing(false);
    setReadZip(null);
    inputRef.current.click();
  };

  /**
   * `readZip`が`null`になった時`processing`を`false`にする。
   */
  React.useEffect(() => {
    if (readZip !== null) {
      setProcessing(false);
      Log.log(`zip読込完了`, "TOPPaper");
    }
  }, [readZip]);

  return (
    <>
      <input
        type="file"
        onChange={OnFileChange}
        hidden
        ref={inputRef}
        accept="application/zip"
      ></input>
      <BasePaper
        title={setting.productName}
        body={
          <Box sx={{ m: 1, p: 1 }}>
            <Typography variant="body1">{t("top.description")}</Typography>
            <br />
            <FullWidthButton
              disabled={processing}
              onClick={OnButtonClick}
              color="primary"
            >
              {!processing ? (
                <>{t("top.selectZipButtonText")}</>
              ) : (
                <CircularProgress color="inherit" size={20} />
              )}
            </FullWidthButton>
          </Box>
        }
      />
      <LoadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        file={readFile}
        setZipFiles={setReadZip}
      />
    </>
  );
};

export interface TopPaperProps {
}
