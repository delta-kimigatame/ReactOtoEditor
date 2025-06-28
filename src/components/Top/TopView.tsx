import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";

import { PrivacyPaper } from "./PrivacyPaper";
import { RulePaper } from "./RulePaper";
import { TopPaper } from "../../features/Top/TopPaper";
import { HistoryPaper } from "./HistoryPaper";
import { TargetDirDialog } from "../TargetDirDialog/TargetDirDialog";

import { Log } from "../../lib/Logging";
import { ShortcutPaper } from "./ShortcutPaper";
import { useOtoProjectStore } from "../../store/otoProjectStore";

/**
 * zipデータを読み込む前の画面
 * @param props {@link TopViewProps}
 * @returns zipデータを読み込む前の画面
 */
export const TopView: React.FC<TopViewProps> = (props) => {
  const { readZip, targetDirs, setTargetDirs, setTargetDir } =
    useOtoProjectStore();
  /** 原音設定対象ディレクトリを選択するためのダイアログ表示設定 */
  const [targetDirDialogOpen, setTargetDirDialogOpen] =
    React.useState<boolean>(false);

  /**
   * zipの読込が完了した際の処理
   * zip内を探索し、wavがあればtargetDirsに登録する。
   */
  React.useEffect(() => {
    if (readZip === null) {
      setTargetDirs(null);
      setTargetDir(null);
      Log.log("targetDir初期化", "TOPView");
    } else {
      const targetDirs: Array<string> = new Array();
      Object.keys(readZip).forEach((f) => {
        if (f.endsWith(".wav")) {
          const tmps = f.split("/").slice(0, -1).join("/");
          if (!targetDirs.includes(tmps)) {
            targetDirs.push(tmps);
          }
        }
      });
      setTargetDirs(targetDirs);
    }
  }, [readZip]);

  /**
   * `targetDirs`が変更されたときの処理。
   * readzip変更後のzip内全探査が終わった時に起動する想定。
   * 原音設定対象ディレクトリを選択するためのダイアログを表示する。
   */
  React.useEffect(() => {
    if (targetDirs !== null) {
      setTargetDirDialogOpen(true);
      Log.log(`targetDirs取得。${targetDirs}`, "TOPView");
    }
  }, [targetDirs]);

  return (
    <>
      <TopPaper />
      <RulePaper />
      <PrivacyPaper />
      <ShortcutPaper />
      <HistoryPaper />
      <TargetDirDialog
        dialogOpen={targetDirDialogOpen}
        setDialogOpen={setTargetDirDialogOpen}
        oto={props.oto}
        setOto={props.setOto}
      />
    </>
  );
};

export interface TopViewProps {
  /** 読み込んだoto.iniのデータ */
  oto: Oto;
  /** 読み込んだoto.iniのデータを変更する処理 */
  setOto: React.Dispatch<React.SetStateAction<Oto | null>>;
}
