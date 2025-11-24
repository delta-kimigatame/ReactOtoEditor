import * as React from "react";
import JSZip from "jszip";

import { useTranslation } from "react-i18next";

import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SelectChangeEvent } from "@mui/material/Select";

import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { FullWidthTextField } from "../../components/Common/FullWidthTextField";
import { LOG } from "../../lib/Logging";
import { GetStorageOto, SaveStorageOto } from "../../services/StorageOto";
import { useOtoProjectStore } from "../../store/otoProjectStore";
import { BatchSelect } from "../../components/TableDialog/BatchSelect";
import { TargetParamSelect } from "../../components/TableDialog/TargetParamSelect";
import { BatchProcess } from "../../types/batchProcess";
import { getBatchList } from "../../config/batchList";
import { Oto } from "utauoto";

export const TableDialogButtonArea: React.FC<TableDialogButtonAreaProps> = (
  props
) => {
  const { zipFileName, readZip, targetDir, oto } = useOtoProjectStore();
  const { t } = useTranslation();
  const [batchIndex, setBatchIndex] = React.useState<number>(0);
  const [targetParam, setTargetParam] = React.useState<string>("offset");
  const [surfix, setSurfix] = React.useState<string>("");
  const [value, setValue] = React.useState<number>(0);
  const [barOpen, setBarOpen] = React.useState<boolean>(false);
  const batchList: Array<BatchProcess> = React.useMemo(
    () => getBatchList(t),
    [t]
  );

  const OnBatchProcessChange = (e: SelectChangeEvent) => {
    setBatchIndex(parseInt(e.target.value));
  };

  const OnTargetParamChange = (e: SelectChangeEvent) => {
    setTargetParam(e.target.value);
  };

  const OnSubmitClick = () => {
    LOG.debug(
      `一括処理:${batchList[batchIndex].description}`,
      "TableDialogButtonArea"
    );
    let param: BatchProps = null;
    if (batchList[batchIndex].requireZip) {
      param = readZip;
    } else if (batchList[batchIndex].requireString) {
      param = surfix;
      LOG.debug(`surfix:${surfix}`, "TableDialogButtonArea");
    } else if (batchList[batchIndex].requireTarget) {
      param = targetParam;
      LOG.debug(`targetParam:${targetParam}`, "TableDialogButtonArea");
    }
    ProcessBatch(
      param,
      oto,
      targetDir,
      batchList,
      batchIndex,
      value,
      zipFileName,
      props,
      setBarOpen
    );
  };

  return (
    <>
      <Accordion data-testid="table-dialog-accordion">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <InputLabel>{t("tableDialog.title")}</InputLabel>
        </AccordionSummary>
        <AccordionDetails>
          <BatchSelect
            label={t("tableDialog.title")}
            batchIndex={batchIndex}
            batchList={batchList}
            onChange={OnBatchProcessChange}
          />
          <Box
            sx={{
              display: batchList[batchIndex].requireString !== true && "none",
            }}
          >
            <FullWidthTextField
              type="text"
              label={t("tableDialog.stringTitle")}
              value={surfix}
              onChange={(e) => {
                setSurfix(e.target.value);
              }}
              data-testid="table-dialog-surfix-input"
            />
          </Box>
          <Box
            sx={{
              display: batchList[batchIndex].requireNumber !== true && "none",
            }}
          >
            <FullWidthTextField
              type="number"
              label={t("tableDialog.numberTitle")}
              value={value}
              onChange={(e) => {
                setValue(parseFloat(e.target.value));
              }}
              data-testid="table-dialog-number-input"
            />
          </Box>
          <Box
            sx={{
              display: batchList[batchIndex].requireTarget !== true && "none",
            }}
          >
            <TargetParamSelect
              label={t("tableDialog.targetTitle")}
              value={targetParam}
              onChange={OnTargetParamChange}
            />
          </Box>

          <FullWidthButton
            onClick={OnSubmitClick}
            data-testid="table-dialog-submit-button"
          >
            {t("tableDialog.submit")}
          </FullWidthButton>
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
        data-testid="table-dialog-snackbar"
      />
    </>
  );
};

export interface TableDialogButtonAreaProps {
  /** ダイアログを表示するか否かを設定する。閉じる際に使用 */
  setDialogOpen: (open: boolean) => void;
  /** 一括変更結果により一覧を更新する。 */
  setUpdateSignal: (signal: number) => void;
}

type BatchProps =
  | { [key: string]: JSZip.JSZipObject }
  | string
  | ("offset" | "overlap" | "preutter" | "velocity" | "blank")
  | null;

export const ProcessBatch = (
  param: BatchProps,
  oto: Oto,
  targetDir: string,
  batchList: Array<BatchProcess>,
  batchIndex: number,
  value: number,
  zipFileName: string,
  props: TableDialogButtonAreaProps,
  setBarOpen: (open: boolean) => void
) => {
  if (param === null) {
    batchList[batchIndex].endPoint(oto, targetDir);
  } else if (batchList[batchIndex].requireNumber) {
    LOG.debug(`value:${value}`, "TableDialogButtonArea");
    batchList[batchIndex].endPoint(oto, targetDir, param, value);
  } else {
    batchList[batchIndex].endPoint(oto, targetDir, param);
  }
  LOG.debug(`一括処理完了`, "TableDialogButtonArea");
  props.setUpdateSignal(Math.random());
  setBarOpen(true);
  const storagedOto: {} = GetStorageOto();
  SaveStorageOto(storagedOto, oto, zipFileName, targetDir);
  localStorage.setItem("oto", JSON.stringify(storagedOto));
  LOG.debug(`localstorageに保存`, "TableDialogButtonArea");
};
