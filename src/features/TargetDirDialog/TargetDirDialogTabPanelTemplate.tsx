import * as React from "react";
import { Oto } from "utauoto";
import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import TabPanel from "@mui/lab/TabPanel";

import { TargetDirDialogCheckList } from "../../components/TargetDirDialog/TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";
import { TargetDirDialogCorrectPanel } from "./TargetDirDialogCorrectPanel";
import { FullWidthButton } from "../../components/Common/FullWidthButton";

import { LOG } from "../../lib/Logging";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * oto.iniテンプレートを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelTemplateProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelTemplate: React.FC<
  TargetDirDialogTabPanelTemplateProps
> = (props) => {
  const { t } = useTranslation();
  const { targetDir } = useOtoProjectStore();
  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOtoTemp] = React.useState<Oto | null>(null);
  /** 読込中判定 */
  const [processing, setProcessing] = React.useState<boolean>(false);
  /** 読み込んだファイル */
  const [readFile, setReadFile] = React.useState<File | null>(null);
  /** エンコード確認OK */
  const [encodeOk, setEncodeOk] = React.useState<boolean>(false);

  const OnReadClick = () => {
    setProcessing(false);
    setReadFile(null);
    inputRef.current.click();
  };
  /**
   * inputのファイルが変更した際のイベント \
   * nullやファイル数が0の時は何もせず終了する。 \
   * ファイルが含まれている場合、1つ目のファイルを`readFile`に代入する。
   * @param e
   */
  const OnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length === 0) return;
    LOG.debug(
      `ファイル読み込み。${e.target.files[0].name}`,
      "TargetDirDialogTabPanelTemplate"
    );
    setProcessing(true);
    setReadFile(e.target.files[0]);
  };
  const LoadOto = (encoding_: string = "SJIS") => {
    LOG.debug(
      `oto.ini"読込。文字コード:${encoding_}`,
      "TargetDirDialogTabPanelTemplate"
    );
    const oto_ = new Oto();
    oto_.InputOtoAsync(targetDir, readFile, encoding_).then(() => {
      LOG.debug(`oto.ini読込完了`, "TargetDirDialogTabPanelTemplate");
      Log.gtag("loadTemplateOto");
      setOtoTemp(oto_);
      setProcessing(false);
    });
  };

  const SetEncodeOk_ = (value: boolean) => {
    LOG.debug(`oto.ini読込文字コード確定`, "TargetDirDialogTabPanelTemplate");
    setEncodeOk(!value);
  };

  React.useEffect(() => {
    if (readFile !== null) {
      LoadOto(encoding);
    }
  }, [readFile]);

  return (
    <TabPanel value="3" sx={{ p: 0 }}>
      <input
        type="file"
        onChange={OnFileChange}
        hidden
        ref={inputRef}
        accept=".ini"
      ></input>
      <FullWidthButton onClick={OnReadClick} disabled={processing}>
        {t("targetDirDialog.readTemplate")}
      </FullWidthButton>
      {oto !== null &&
        (encodeOk ? (
          <>
            <TargetDirDialogCorrectPanel
              setDialogOpen={props.setDialogOpen}
            />
          </>
        ) : (
          <>
            <Divider />
            <TargetDirDialogButtonArea
              oto={oto}
              setOtoTemp={setOtoTemp}
              setDialogOpen={SetEncodeOk_}
              LoadOto={LoadOto}
              encoding={encoding}
              setEncoding={setEncoding}
            />
            <TargetDirDialogCheckList oto={oto} />
          </>
        ))}
    </TabPanel>
  );
};

export interface TargetDirDialogTabPanelTemplateProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
