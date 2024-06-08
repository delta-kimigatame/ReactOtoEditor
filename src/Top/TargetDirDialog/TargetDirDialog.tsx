import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

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
          oto={props.oto}
          setOto={props.setOto}
          readZip={props.readZip}
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
  oto: Oto;
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  readZip: { [key: string]: JSZip.JSZipObject } | null;
};
