import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import { FullWidthSelect } from "../../components/Common/FullWidthSelect";
import { SelectChangeEvent } from "@mui/material/Select";

export const BatchSelect: React.FC<BatchSelectProps> = ({
  label,
  batchIndex,
  batchList,
  onChange,
}) => (
  <FullWidthSelect
    label={label}
    value={batchIndex.toString()}
    onChange={onChange}
    data-testid="table-dialog-batch-select"
  >
    {batchList.map((bl, i) => (
      <MenuItem value={i} key={"BP_" + i}>
        {bl.description}
      </MenuItem>
    ))}
  </FullWidthSelect>
);

export interface BatchSelectProps {
  label: string;
  batchIndex: number;
  batchList: { description: string }[];
  onChange: (e: SelectChangeEvent) => void;
}
