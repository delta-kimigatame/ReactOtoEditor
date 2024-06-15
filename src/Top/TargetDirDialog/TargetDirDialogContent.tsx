import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { TargetDirDialogSelectDir } from "./TargetDirDialogSelectDir";
import { TargetDirDialogCheckList } from "./TargetDirDialogCheckList";
import { TargetDirDialogButtonArea } from "./TargetDirDialogButtonArea";

export const TargetDirDialogContent: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [nothingOto, setNothingOto] = React.useState<boolean>(false);
  const [oto, setOto] = React.useState<Oto | null>(null);
  const [encoding, setEncoding] = React.useState<string>("SJIS");

  React.useEffect(() => {
    if (props.targetDir === null) return;
    if (props.readZip === null) return;
    setNothingOto(false);
    LoadOto();
  }, [props.targetDir]);

  const LoadOto = (encoding_: string = "SJIS") => {
    if (Object.keys(props.readZip).includes(props.targetDir + "/oto.ini")) {
      props.readZip[props.targetDir + "/oto.ini"]
        .async("arraybuffer")
        .then((result) => {
          const oto = new Oto();
          oto
            .InputOtoAsync(
              props.targetDir,
              new Blob([result], { type: "text/plain" }),
              encoding_
            )
            .then(() => {
              setOto(oto);
            });
        });
    } else {
      setNothingOto(true);
    }
  };

  return (
    <>
      <DialogContent>
        <TargetDirDialogSelectDir
          targetDirs={props.targetDirs}
          targetDir={props.targetDir}
          setTargetDir={props.setTargetDir}
        />
        <Divider />
        <Box sx={{ p: 1 }}>
          {nothingOto ? (
            <>
              <Typography>{t("targetDirDialog.NothingOto")}</Typography>
            </>
          ) : oto !== null ? (
            <>
              <TargetDirDialogButtonArea
                oto={oto}
                setOto={props.setOto}
                setOtoTemp={setOto}
                setDialogOpen={props.setDialogOpen}
                LoadOto={LoadOto}
                encoding={encoding}
                setEncoding={setEncoding}
              />
              <Divider />
              <TargetDirDialogCheckList oto={oto} targetDir={props.targetDir} />
            </>
          ) :props.targetDir!==null && (
            <>
              <Box sx={{ textAlign: "center", minHeight: 150 }}>
                <CircularProgress size={100} sx={{ maxWidth: "100%" }} />
              </Box>
            </>
          )}
        </Box>
      </DialogContent>
    </>
  );
};

type Props = {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  targetDirs: Array<string> | null;
  targetDir: string | null;
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  oto: Oto;
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
  readZip: { [key: string]: JSZip.JSZipObject } | null;
};
