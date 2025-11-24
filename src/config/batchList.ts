import { BatchProcess } from "../types/batchProcess"; 
import * as BP from "../lib/OtoBatchProcess";
import { TFunction } from "i18next";

export const getBatchList = (t: TFunction): Array<BatchProcess> => {
  const batches: Array<BatchProcess> = [];
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
};
