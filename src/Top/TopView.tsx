import * as React from "react";
import JSZip from "jszip";

import { PrivacyPaper } from "./PrivacyPaper";
import { RulePaper } from "./RulePaper";
import { TopPaper } from "./TopPaper";

export const TopView: React.FC<Props> = (props) => {
  return (
    <>
      <TopPaper readZip={props.readZip} setReadZip={props.setReadZip} />
      <RulePaper />
      <PrivacyPaper />
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
};
