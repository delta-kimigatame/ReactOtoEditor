import * as React from "react";
import JSZip from "jszip";

import { useTranslation } from "react-i18next";
import { setting } from "../settings/setting";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { LoadZipDialog } from "./LoadZipDialog/LoadZipDialog";

export const TopPaper: React.FC<Props> = (props) => {
  const inputRef = React.useRef(null);
  const { t } = useTranslation();
  const [processing, setProcessing] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [readFile, setReadFile] = React.useState<File | null>(null);
  const [zipFiles, setZipFiles] = React.useState<{
    [key: string]: JSZip.JSZipObject;
  } | null>(null);

  const OnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setProcessing(true);
    setReadFile(e.target.files[0]);
    setDialogOpen(true);
  };

  const OnButtonClick = () => {
    setProcessing(false);
    props.setReadZip(null);
    inputRef.current.click();
  };

  React.useEffect(() => {
    if (zipFiles !== null) {
      setProcessing(false);
    }
  }, [zipFiles]);

  return (
    <>
      <input type="file" onChange={OnFileChange} hidden ref={inputRef}></input>
      <Paper elevation={2} sx={{ m: 1, p: 2 }}>
        <Typography variant="h6">{setting.product_name}</Typography>
        <Divider />
        <Box sx={{ m: 1, p: 1 }}>
          <Typography variant="body1">{t("top.description")}</Typography>
          <br />
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
            disabled={processing}
            onClick={OnButtonClick}
          >
            {!processing ? (
              <>{t("top.selectZipButtonText")}</>
            ) : (
              <CircularProgress color="inherit" size={20} />
            )}
          </Button>
        </Box>
      </Paper>
      <LoadZipDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        file={readFile}
        setZipFiles={setZipFiles}
      />
    </>
  );
};

type Props = {
  readZip: ArrayBuffer;
  setReadZip: React.Dispatch<React.SetStateAction<ArrayBuffer>>;
};
