import * as React from "react";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import { TargetDirDialogTitle } from "./TargetDirDialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { TargetDirDialogContent } from "./TargetDirDialogContent";

export const TargetDirDialog: React.FC<Props> = (props) => {
  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullWidth
      >
        <TargetDirDialogTitle setDialogOpen={props.setDialogOpen} />
        <Divider />
        <TargetDirDialogContent
          setDialogOpen={props.setDialogOpen}
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
        />
      </Dialog>
    </>
  );
};

type Props = {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetDirs: Array<string> | null;
  targetDir: string | null;
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
};
