import * as React from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { FullWidthButton } from "../../components/Common/FullWidthButton";
import { LogPaper } from "../../components/Top/LogPaper";
import { LOG } from "../../lib/Logging";

export interface ShowLogDialogProps {
  /** ダイアログの開閉状態 */
  open: boolean;
  /** ダイアログを閉じる処理 */
  onClose: () => void;
  /** 親メニューを閉じるために使用 */
  setMenuAnchor: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
}

/**
 * logを表示するダイアログ
 * @param props {@link ShowLogDialogProps}
 */
export const ShowLogDialog: React.FC<ShowLogDialogProps> = (props) => {
  const { t } = useTranslation();

  const OnLogDownload = () => {
    const text = LOG.datas.join("\r\n");
    const logFile = new File([text], `log_${new Date().toJSON()}.txt`, {
      type: "text/plane;charset=utf-8",
    });
    const url = URL.createObjectURL(logFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = logFile.name;
    a.click();
    props.setMenuAnchor(null);
    props.onClose();
  };

  return (
    <Dialog onClose={props.onClose} open={props.open} fullScreen>
      <DialogTitle>
        <Box sx={{ m: 1, p: 1 }}>
          <Typography variant="body1" color="error">
            {t("menu.logAttention")}
          </Typography>
          <FullWidthButton onClick={OnLogDownload}>
            {t("error.download")}
          </FullWidthButton>
        </Box>
        <Divider />
      </DialogTitle>
      <IconButton
        onClick={props.onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <LogPaper />
      </DialogContent>
    </Dialog>
  );
};