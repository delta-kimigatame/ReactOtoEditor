import * as React from "react";

import TextField from "@mui/material/TextField";

export interface FullWidthTextFieldProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  value: string | number;
  label: React.ReactNode;
  type: React.HTMLInputTypeAttribute;
  "data-testid"?: string;
}

export const FullWidthTextField: React.FC<FullWidthTextFieldProps> = (props) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      sx={{
        m: 1,
      }}
      type={props.type}
      label={props.label}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
      data-testid={props["data-testid"]}
    />
  );
};
