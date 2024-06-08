import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { PrivacyPaper } from "./PrivacyPaper";
import { RulePaper } from "./RulePaper";
import { TopPaper } from "./TopPaper";
import { TargetDirDialog } from "./TargetDirDialog/TargetDirDialog";

export const TopView: React.FC<Props> = (props) => {
  const [targetDirDialogOpen, setTargetDirDialogOpen] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    if (props.readZip === null) {
      props.setTargetDirs(null);
      props.setTargetDir(null);
    } else {
      const targetDirs: Array<string> = new Array();
      Object.keys(props.readZip).forEach((f) => {
        if (f.endsWith(".wav")) {
          const tmps = f.split("/").slice(0, -1).join("/");
          if (!targetDirs.includes(tmps)) {
            targetDirs.push(tmps);
          }
        }
      });
      props.setTargetDirs(targetDirs);
    }
  }, [props.readZip]);

  React.useEffect(() => {
    if (props.targetDirs !== null) {
      setTargetDirDialogOpen(true);
    }
  }, [props.targetDirs]);

  return (
    <>
      <TopPaper readZip={props.readZip} setReadZip={props.setReadZip} />
      <RulePaper />
      <PrivacyPaper />
      <TargetDirDialog
        dialogOpen={targetDirDialogOpen}
        setDialogOpen={setTargetDirDialogOpen}
        targetDirs={props.targetDirs}
        targetDir={props.targetDir}
        setTargetDir={props.setTargetDir}
        oto={props.oto}
        setOto={props.setOto}
        readZip={props.readZip}
      />
    </>
  );
};

type Props = {
  readZip: { [key: string]: JSZip.JSZipObject } | null;
  setReadZip: React.Dispatch<
    React.SetStateAction<{
      [key: string]: JSZip.JSZipObject;
    } | null>
  >;
  targetDirs: Array<string> | null;
  targetDir: string | null;
  oto: Oto;
  setTargetDirs: React.Dispatch<React.SetStateAction<Array<string> | null>>;
  setTargetDir: React.Dispatch<React.SetStateAction<string | null>>;
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
};
