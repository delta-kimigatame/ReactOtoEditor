import * as React from "react";
import { PaletteMode } from "@mui/material";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { useTranslation } from "react-i18next";

import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { EditorButton } from "./EditorButton";

export const PrevAliasButton: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  const OnPrevAlias = () => {
    if (props.aliasIndex === 0) {
      if (props.fileIndex !== 0) {
        const filename = props.oto.GetFileNames(props.targetDir)[props.fileIndex - 1];
        const maxAliases =
          props.oto.GetAliases(props.targetDir, filename).length - 1;
        const alias = props.oto.GetAliases(props.targetDir, filename)[
          maxAliases
        ];
        console.log(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setRecord(props.oto.GetRecord(props.targetDir, filename, alias));
        props.setFileIndex(props.fileIndex + 1);
        props.setAliasIndex(0);
        props.setMaxAliasIndex(maxAliases);
      }
    } else {
      const alias = props.oto.GetAliases(
        props.targetDir,
        props.record.filename
      )[props.aliasIndex - 1];
      props.setRecord(
        props.oto.GetRecord(props.targetDir, props.record.filename, alias)
      );
      props.setAliasIndex(props.aliasIndex - 1);
    }
  };

  return (
    <>
      <EditorButton
            mode={props.mode}
            size={props.size}
            icon={<ArrowDropUpIcon sx={{ fontSize: props.iconSize }} />}
            title={t("editor.prev")}
            onClick={OnPrevAlias}
            disabled={props.aliasIndex === 0 && props.fileIndex === 0}
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
