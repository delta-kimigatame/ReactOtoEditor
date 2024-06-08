import * as React from "react";

import { useTranslation } from "react-i18next";

import { PrivacyPaper } from "./PrivacyPaper";
import { RulePaper } from "./RulePaper";
import { TopPaper } from "./TopPaper";

export const TopView: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <TopPaper readZip={props.readZip} setReadZip={props.setReadZip} />
      <RulePaper />
      <PrivacyPaper />
    </>
  );
};

type Props = {
  readZip: ArrayBuffer;
  setReadZip: React.Dispatch<React.SetStateAction<ArrayBuffer>>;
};
