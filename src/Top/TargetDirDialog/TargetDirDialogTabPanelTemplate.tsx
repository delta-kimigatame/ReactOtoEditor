import * as React from "react";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TabPanel from "@mui/lab/TabPanel";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";
import { FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { AddParams } from "../../Lib/OtoBatchProcess";
import { TargetDirDialogCorrectPanel } from "./TargetDirDialogCorrectPanel";

/**
 * oto.iniテンプレートを読み込む場合のパネル
 * @param props {@link TargetDirDialogTabPanelTemplateProps}
 * @returns oto.iniテンプレートを読み込む場合のパネル
 */
export const TargetDirDialogTabPanelTemplate: React.FC<
  TargetDirDialogTabPanelTemplateProps
> = (props) => {
  const { t } = useTranslation();
  /** 隠し表示する<input>へのref */
  const inputRef = React.useRef(null);
  /** oto.ini読込の文字コード */
  const [encoding, setEncoding] = React.useState<string>("SJIS");
  /** oto.iniの仮読込。文字コード確認のため親コンポーネントとは個別で値を保持する。 */
  const [oto, setOto] = React.useState<Oto | null>(null);
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
    setProcessing(true);
    setReadFile(e.target.files[0]);
  };
  const LoadOto = (encoding_: string = "SJIS") => {
    const oto_ = new Oto();
    oto_.InputOtoAsync(props.targetDir, readFile, encoding_).then(() => {
      setOto(oto_);
      setProcessing(false);
    });
  };

  const SetEncodeOk_ = (value: boolean) => {
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
      <Button
        fullWidth
        variant="contained"
        sx={{ m: 1 }}
        onClick={OnReadClick}
        size="large"
        color="inherit"
        disabled={processing}
      >
        {t("targetDirDialog.readTemplate")}
      </Button>
      {oto !== null &&
        (encodeOk ? (
          <>
            <TargetDirDialogCorrectPanel
              oto={oto}
              setOto={props.setOto}
              setDialogOpen={props.setDialogOpen}
              targetDir={props.targetDir}
            />
          </>
        ) : (
          <>
            <Divider />
            <TargetDirDialogButtonArea
              oto={oto}
              setOto={setOto}
              setOtoTemp={setOto}
              setDialogOpen={SetEncodeOk_}
              LoadOto={LoadOto}
              encoding={encoding}
              setEncoding={setEncoding}
            />
            <TargetDirDialogCheckList oto={oto} targetDir={props.targetDir} />
          </>
        ))}
    </TabPanel>
  );
};

export interface TargetDirDialogTabPanelTemplateProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 現在原音設定の対象になっているディレクトリ */
  targetDir: string | null;
  /** 読み込んだoto.iniのデータを変更する処理。親コンポーネントに返す用 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
}
