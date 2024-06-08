import * as React from "react";
import JSZip from "jszip";

import { useTranslation } from "react-i18next";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";

import { LoadZipButtonArea } from "./LoadZipButtonArea";

export const LoadZipDialogContent: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <>
      <DialogContent>
        <Box sx={{ p: 1 }}>
          <Box sx={{ pl: 1 }}>
            {props.processing ? (
              <Box sx={{ textAlign: "center", minHeight: 150 }}>
                <CircularProgress size={100} sx={{ maxWidth: "100%" }} />
              </Box>
            ) : props.zipFiles !== null ? (
              <>
                <LoadZipButtonArea
                  file={props.file}
                  encoding={props.encoding}
                  zipFiles={props.zipFiles}
                  LoadZip={props.LoadZip}
                  setDialogOpen={props.setDialogOpen}
                  setProcessing={props.setProcessing}
                  setEncoding={props.setEncoding}
                  setZipFiles={props.setZipFiles}
                />
                {Object.keys(props.zipFiles).map((f) => (
                  <>
                    <Typography variant="body2">{f}</Typography>
                    <Divider />
                  </>
                ))}
              </>
            ) : (
              <>
                <Typography variant="body2">
                  {t("loadZipDialog.error")}
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};

type Props = {
  file: File | null;
  processing: boolean;
  encoding: string;
  zipFiles: {
    [key: string]: JSZip.JSZipObject;
  } | null;
  LoadZip: (file: File, encoding?: string) => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  setEncoding: React.Dispatch<React.SetStateAction<string>>;
  setZipFiles: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
};
