import * as React from "react";
import { Oto } from "utauoto";
import JSZip from "jszip";
import * as BP from "../../Lib/OtoBatchProcess";

import { useTranslation } from "react-i18next";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const TableDialogButtonArea: React.FC<TableDialogButtonAreaProps> = (
  props
) => {
  const { t } = useTranslation();
  const [batchIndex, setBatchIndex] = React.useState<number>(0);
  const [targetParam, setTargetParam] = React.useState<string>("offset");
  const [surfix, setSurfix] = React.useState<string>("");
  const [value, setValue] = React.useState<number>(0);
  const [barOpen, setBarOpen] = React.useState<boolean>(false);
  const batchList: Array<BatchProcess> = React.useMemo(() => {
    const batches: Array<BatchProcess> = new Array();
    batches.push({
      description: t("tableDialog.batchProcess.wavNotFound"),
      requireZip: true,
      endPoint: BP.WaveNotFound,
    });
    batches.push({
      description: t("tableDialog.batchProcess.recordNotFound"),
      requireZip: true,
      endPoint: BP.RecordNotFound,
    });
    batches.push({
      description: t("tableDialog.batchProcess.numberingDuplicationAlias"),
      requireString: true,
      requireNumber: true,
      endPoint: BP.NumberingDuplicationAlias,
    });
    batches.push({
      description: t("tableDialog.batchProcess.limitedNumber"),
      requireString: true,
      requireNumber: true,
      endPoint: BP.LimitedNumber,
    });
    batches.push({
      description: t("tableDialog.batchProcess.negativeBlank"),
      requireZip: true,
      endPoint: BP.NegativeBlank,
    });
    batches.push({
      description: t("tableDialog.batchProcess.forceOverlapRate"),
      endPoint: BP.ForceOverlapRate,
    });
    batches.push({
      description: t("tableDialog.batchProcess.removeSurfix"),
      requireString: true,
      endPoint: BP.RemoveSurfix,
    });
    batches.push({
      description: t("tableDialog.batchProcess.addSurfix"),
      requireString: true,
      endPoint: BP.AddSurfix,
    });
    batches.push({
      description: t("tableDialog.batchProcess.addParams"),
      requireNumber: true,
      requireTarget: true,
      endPoint: BP.AddParams,
    });
    batches.push({
      description: t("tableDialog.batchProcess.changeParams"),
      requireNumber: true,
      requireTarget: true,
      endPoint: BP.ChangeParams,
    });
    batches.push({
      description: t("tableDialog.batchProcess.aliasComplement"),
      endPoint: BP.AliasComplement,
    });
    return batches;
  }, []);

  const OnBatchProcessChange = (e: SelectChangeEvent) => {
    setBatchIndex(parseInt(e.target.value));
  };

  const OnTargetParamChange = (e: SelectChangeEvent) => {
    setTargetParam(e.target.value);
  };

  const OnSubmitClick = () => {
    let param:
      | { [key: string]: JSZip.JSZipObject }
      | string
      | ("offset" | "overlap" | "preutter" | "velocity" | "blank")
      | null = null;
    if (batchList[batchIndex].requireZip) {
      param = props.zip;
    } else if (batchList[batchIndex].requireString) {
      param = surfix;
    } else if (batchList[batchIndex].requireTarget) {
      param = targetParam;
    }
    if (param === null) {
      batchList[batchIndex].endPoint(props.oto, props.targetDir);
    } else if (batchList[batchIndex].requireNumber) {
      batchList[batchIndex].endPoint(props.oto, props.targetDir, param, value);
    } else {
      batchList[batchIndex].endPoint(props.oto, props.targetDir, param);
    }
    props.setUpdateSignal(Math.random());
    setBarOpen(true);
    const storagedOto_: string | null = localStorage.getItem("oto");
    const storagedOto: {} =
      storagedOto_ === null ? {} : JSON.parse(storagedOto_);
    if (!(props.zipFileName in storagedOto)) {
      storagedOto[props.zipFileName] = {};
    }
    storagedOto[props.zipFileName][props.targetDir] = {
      oto: props.oto.GetLines()[props.targetDir].join("\r\n"),
      update_date: Date.now(),
    };
    localStorage.setItem("oto", JSON.stringify(storagedOto));
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InputLabel>{t("tableDialog.title")}</InputLabel>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ m: 1 }}>
            <Select
              label="batch_process"
              variant="filled"
              color="primary"
              value={batchIndex.toString()}
              onChange={OnBatchProcessChange}
            >
              {batchList.map((bl, i) => (
                <MenuItem value={i} key={"BP_" + i}>
                  {bl.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            sx={{
              m: 1,
              display: batchList[batchIndex].requireString !== true && "none",
            }}
            label={t("tableDialog.stringTitle")}
            value={surfix}
            onChange={(e) => {
              setSurfix(e.target.value);
            }}
          />
          <TextField
            fullWidth
            variant="outlined"
            sx={{
              m: 1,
              display: batchList[batchIndex].requireNumber !== true && "none",
            }}
            type="number"
            label={t("tableDialog.numberTitle")}
            value={value}
            onChange={(e) => {
              setValue(parseFloat(e.target.value));
            }}
          />
          <FormControl
            fullWidth
            sx={{
              m: 1,
              display: batchList[batchIndex].requireTarget !== true && "none",
            }}
          >
            <InputLabel>{t("tableDialog.targetTitle")}</InputLabel>
            <Select
              label="target"
              variant="filled"
              color="primary"
              value={targetParam}
              onChange={OnTargetParamChange}
            >
              <MenuItem value={"offset"}>{t("oto.offset")}</MenuItem>
              <MenuItem value={"overlap"}>{t("oto.overlap")}</MenuItem>
              <MenuItem value={"preutter"}>{t("oto.preutter")}</MenuItem>
              <MenuItem value={"velocity"}>{t("oto.velocity")}</MenuItem>
              <MenuItem value={"blank"}>{t("oto.blank")}</MenuItem>
            </Select>
          </FormControl>
          <Button
            fullWidth
            sx={{ m: 1 }}
            variant="contained"
            color="primary"
            onClick={OnSubmitClick}
          >
            {t("tableDialog.submit")}
          </Button>
        </AccordionDetails>
      </Accordion>
      <Snackbar
        open={barOpen}
        autoHideDuration={1000}
        onClose={() => {
          setBarOpen(false);
        }}
        message={t("tableDialog.processed")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export interface TableDialogButtonAreaProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** 原音設定データ */
  oto: Oto;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** zipデータ */
  zip: {
    [key: string]: JSZip.JSZipObject;
  } | null;
  /** 一括変更結果により一覧を更新する。 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** zipのファイル名 */
  zipFileName: string;
}

interface BatchProcess {
  /** プロセスの説明文。選択メニューに表示 */
  description: string;
  /** 引数として文字列をとるか */
  requireString?: boolean;
  /** 引数として数字をとるか */
  requireNumber?: boolean;
  /** 引数としてtargetをとるか */
  requireTarget?: boolean;
  /** 引数としてzipをとるか */
  requireZip?: boolean;
  /** 処理 */
  endPoint: (
    oto: Oto,
    targetDir: string,
    param?:
      | { [key: string]: JSZip.JSZipObject }
      | string
      | ("offset" | "overlap" | "preutter" | "velocity" | "blank"),
    value?: number
  ) => void;
}
