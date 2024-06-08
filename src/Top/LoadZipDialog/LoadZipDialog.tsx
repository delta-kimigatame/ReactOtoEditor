import * as React from "react";
import JSZip from "jszip";

import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import { LoadZipDialogContent } from "./LoadZipDialogContent";
import { LoadZipDialogTitle } from "./LoadZipDialogTitle";

export const LoadZipDialog: React.FC<Props> = (props) => {
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [zipFiles, setZipFiles] = React.useState<{
    [key: string]: JSZip.JSZipObject;
  } | null>(null);
  const [encoding, setEncoding] = React.useState<string>("utf-8");

  const LoadZip = (file: File, encoding: string = "utf-8") => {
    const zip = new JSZip();
    const td = new TextDecoder(encoding);
    zip
      .loadAsync(file, {
        decodeFileName: (fileNameBinary: Uint8Array) =>
          td.decode(fileNameBinary),
      })
      .then((z) => {
        setProcessing(false);
        setZipFiles(z.files);
      });
  };

  React.useEffect(() => {
    if (props.file === null) {
      props.setDialogOpen(false);
    } else {
      setProcessing(true);
      LoadZip(props.file);
    }
  }, [props.file]);

  return (
    <>
      <Dialog
        onClose={() => {
          props.setDialogOpen(false);
        }}
        open={props.dialogOpen}
        fullWidth
      >
        <LoadZipDialogTitle setDialogOpen={props.setDialogOpen} />
        <Divider />
        <LoadZipDialogContent
          file={props.file}
          processing={processing}
          encoding={encoding}
          zipFiles={zipFiles}
          LoadZip={LoadZip}
          setDialogOpen={props.setDialogOpen}
          setProcessing={setProcessing}
          setEncoding={setEncoding}
          setZipFiles={props.setZipFiles}
        />
      </Dialog>
    </>
  );
};

type Props = {
  file: File | null;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setZipFiles: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
};
