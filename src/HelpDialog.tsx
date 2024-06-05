import * as React from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

import { product_name } from "./settings/setting";

/**
 * このアプリの説明を表示するダイアログ
 *  */
export const HelpDialog: React.FC<Props> = (props) => {
  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullWidth
      >
        <DialogTitle>{product_name}</DialogTitle>
        <IconButton
          onClick={() => {
            props.setDialogOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Divider />
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Typography variant="h6">これは何?</Typography>
            <Box sx={{ pl: 3 }}>
              <Typography variant="body2">
                wavデータをUTAUで使用できる形式に変換します。
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

type Props = {
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  };
  