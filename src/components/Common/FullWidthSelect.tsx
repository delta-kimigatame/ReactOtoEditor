import * as React from "react";

import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const FullWidthSelect: React.FC<{label:string,value,onChange,children,"data-testid"?: string}> = (props) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        label={props.label}
        variant="filled"
        defaultValue=""
        value={props.value}
        onChange={props.onChange}
        data-testid={props["data-testid"]}
      >
        {props.children}
      </Select>
    </FormControl>
  );
};
