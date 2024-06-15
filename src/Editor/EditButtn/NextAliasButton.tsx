import * as React from "react";
import { PaletteMode } from "@mui/material";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { useTranslation } from "react-i18next";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { EditorButton } from "./EditorButton";

export const NextAliasButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const OnNextAlias = () => {
    if (props.maxAliasIndex === props.aliasIndex) {
      if (props.maxFileIndex !== props.fileIndex) {
        const filename = props.oto.GetFileNames(props.targetDir)[props.fileIndex + 1];
        const alias = props.oto.GetAliases(props.targetDir, filename)[0];
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setFileIndex(props.fileIndex + 1);
        props.setAliasIndex(0);
        props.setMaxAliasIndex(
          props.oto.GetAliases(props.targetDir, filename).length - 1
        );
      }
    } else {
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[props.aliasIndex + 1];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      props.setAliasIndex(props.aliasIndex + 1);
    }
  };

  return (
    <>
      <EditorButton
        mode={props.mode}
        size={props.size}
        icon={<ArrowDropDownIcon sx={{ fontSize: props.iconSize }} />}
        title={t("editor.next")}
        onClick={OnNextAlias}
        disabled={props.maxAliasIndex === props.aliasIndex && props.maxFileIndex === props.fileIndex}
      />
    </>
  );
};

type Props = {
  targetDir: string;
  oto: Oto;
  record: OtoRecord | null;
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
  mode: PaletteMode;
  size: number;
  iconSize: number;
  fileIndex: number;
  aliasIndex: number;
  maxFileIndex: number;
  maxAliasIndex: number;
  setFileIndex: React.Dispatch<React.SetStateAction<number>>;
  setAliasIndex: React.Dispatch<React.SetStateAction<number>>;
  setMaxAliasIndex: React.Dispatch<React.SetStateAction<number>>;
};
