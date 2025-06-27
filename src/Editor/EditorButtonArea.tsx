import * as React from "react";
import JSZip from "jszip";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";
import { Wave } from "utauwav";

import { styled } from "@mui/system";
import { PaletteMode } from "@mui/material";
import { useTranslation } from "react-i18next";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import TableViewIcon from "@mui/icons-material/TableView";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import LockIcon from "@mui/icons-material/Lock";
import TouchAppIcon from "@mui/icons-material/TouchApp";

import { layout } from "../settings/setting";
import { EditorButton } from "./EditButtn/EditorButton";
import { NextAliasButton, OnNextAlias } from "./EditButtn/NextAliasButton";
import { OnPrevAlias, PrevAliasButton } from "./EditButtn/PrevAliasButtn";
import {
  OnPlayBeforePreutter,
  PlayBeforePreutterButton,
} from "./EditButtn/PlayBeforePreutterButton";
import {
  OnPlayAfterPreutter,
  PlayAfterPreutterButton,
} from "./EditButtn/PlayAfterPreutterButton";
import { OnPlay, PlayButton } from "./EditButtn/PlayButton";
import { TableDialog } from "../TableDialog/TableDialog";
import { AliasDialog } from "../AliasDialog/AliasDialog";

/**
 * 編集画面の操作ボタン
 * @param props {@link EditorButtonAreaProps}
 * @returns 編集画面の操作ボタン
 */
export const EditorButtonArea: React.FC<EditorButtonAreaProps> = (props) => {
  const { t } = useTranslation();
  /** ボタンのサイズ */
  const [size, setSize] = React.useState<number>(layout.minButtonSize);
  /** ボタンのアイコンサイズ */
  const [iconSize, setIconSize] = React.useState<number>(layout.minIconSize);
  /** ファイル数 */
  const [maxFileIndex, setMaxFileIndex] = React.useState<number>(0);
  /** 現在のファイルに登録されているエイリアス数 */
  const [maxAliasIndex, setMaxAliasIndex] = React.useState<number>(0);
  /** 現在のファイルのインデックス */
  const [fileIndex, setFileIndex] = React.useState<number>(0);
  /** 現在のエイリアスのインデックス */
  const [aliasIndex, setAliasIndex] = React.useState<number>(0);
  /** TableDialogの表示 */
  const [tableDialogOpen, setTableDialogOpen] = React.useState<boolean>(false);
  /** AliasDialogの表示 */
  const [aliasDialogOpen, setAliasDialogOpen] = React.useState<boolean>(false);
  /** メトロノームのwavデータ */
  const [metronome, setMetronome] = React.useState<Wave>(null);
  /** メトロノームのwavデータを読み込む処理 */
  React.useMemo(() => {
    fetch(location.href + "static/metronome.wav").then((res) => {
      res.arrayBuffer().then((buf) => {
        const m = new Wave(buf);
        setMetronome(m);
      });
    });
  }, []);

  /** 画面サイズが変わった際、ボタンの大きさを再度算定する。 */
  React.useEffect(() => {
    CalcSize();
    props.setButtonAreaHeight(areaRef.current.getBoundingClientRect().height);
  }, [props.windowWidth, props.windowHeight]);
  const areaRef = React.useRef(null);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      } else if (tableDialogOpen || aliasDialogOpen) {
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        OnPrevAlias(
          props.oto,
          props.targetDir,
          props.record,
          maxFileIndex,
          fileIndex,
          maxAliasIndex,
          aliasIndex,
          props.setRecord,
          setFileIndex,
          setAliasIndex,
          setMaxAliasIndex
        );
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        OnNextAlias(
          props.oto,
          props.targetDir,
          props.record,
          maxFileIndex,
          fileIndex,
          maxAliasIndex,
          aliasIndex,
          props.setRecord,
          setFileIndex,
          setAliasIndex,
          setMaxAliasIndex
        );
      } else if (e.key === "+") {
        OnZoomIn();
      } else if (e.key === "-") {
        OnZoomOut();
      } else if (e.key === "1") {
        OnPlayBeforePreutter(props.record, props.wav);
      } else if (e.key === "2") {
        OnPlayAfterPreutter(props.record, props.wav);
      } else if (e.key === "3") {
        OnPlay(props.record, props.wav, metronome);
      } else if (e.key === "4") {
        props.setOverlapLock(!props.overlapLock);
      } else if (e.key === "5") {
        props.setTouchMode(!props.touchMode);
      } else if (e.key === "6") {
        setAliasDialogOpen(true);
      } else if (e.key === "7") {
        setTableDialogOpen(true);
      }
    },
    [
      props,
      maxFileIndex,
      fileIndex,
      maxAliasIndex,
      aliasIndex,
      tableDialogOpen,
      aliasDialogOpen,
    ]
  );
  /** キーボードショートカットの作成 */
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * ボタンの大きさを算定する
   */
  const CalcSize = () => {
    const maxHeight = props.windowHeight - 319;
    const maxWidth = props.windowWidth / 12;
    const s = Math.min(
      Math.max(
        Math.min(maxHeight - layout.iconPadding, maxWidth - layout.iconPadding),
        layout.minButtonSize
      ),
      layout.maxButtonSize
    );
    setSize(s);
    setIconSize(Math.min(Math.max(s - layout.iconPadding, layout.minIconSize)));
  };

  /**
   * 原音設定が初期化された際の処理
   */
  React.useEffect(() => {
    if (props.oto === null) {
      setMaxFileIndex(0);
      setFileIndex(0);
      setAliasIndex(0);
      setMaxAliasIndex(0);
    } else {
      setMaxFileIndex(props.oto.GetFileNames(props.targetDir).length - 1);
    }
  }, [props.oto]);

  /**
   * 選択中の原音設定レコードが変更された際の処理
   */
  React.useEffect(() => {
    if (props.record === null) {
      setAliasIndex(0);
      setMaxAliasIndex(0);
    } else {
      setMaxAliasIndex(
        props.oto.GetAliases(props.targetDir, props.record.filename).length - 1
      );
    }
  }, [props.record]);

  /**
   * キャンバスの拡大
   */
  const OnZoomIn = () => {
    if (props.pixelPerMsec === 20) {
      props.setPixelPerMsec(10);
    } else if (props.pixelPerMsec === 10) {
      props.setPixelPerMsec(5);
    } else if (props.pixelPerMsec === 5) {
      props.setPixelPerMsec(2);
    } else if (props.pixelPerMsec === 2) {
      props.setPixelPerMsec(1);
    }
  };

  /**
   * キャンバスの縮小
   */
  const OnZoomOut = () => {
    if (props.pixelPerMsec === 1) {
      props.setPixelPerMsec(2);
    } else if (props.pixelPerMsec === 2) {
      props.setPixelPerMsec(5);
    } else if (props.pixelPerMsec === 5) {
      props.setPixelPerMsec(10);
    } else if (props.pixelPerMsec === 10) {
      props.setPixelPerMsec(20);
    }
  };

  return (
    <>
      <Paper
        sx={{
          justifyContent: "space-between",
          display: "flex",
          overflowX: "hidden",
        }}
        ref={areaRef}
      >
        <StyledBox>
          <PlayBeforePreutterButton
            targetDir={props.targetDir}
            wav={props.wav}
            record={props.record}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
          />
          <PlayAfterPreutterButton
            targetDir={props.targetDir}
            wav={props.wav}
            record={props.record}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
          />
          <PlayButton
            targetDir={props.targetDir}
            wav={props.wav}
            record={props.record}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
            metronome={metronome}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={
              <LockIcon
                sx={{ fontSize: iconSize }}
                color={props.overlapLock ? "info" : "inherit"}
              />
            }
            title={t("editor.lockOverlap")}
            onClick={() => {
              props.setOverlapLock(!props.overlapLock);
            }}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={
              <TouchAppIcon
                sx={{ fontSize: iconSize }}
                color={props.touchMode ? "info" : "inherit"}
              />
            }
            title={t("editor.touchMode")}
            onClick={() => {
              props.setTouchMode(!props.touchMode);
            }}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<EditAttributesIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.editAlias")}
            disabled={props.record === null}
            onClick={() => {
              setAliasDialogOpen(true);
            }}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<TableViewIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.showTable")}
            onClick={() => {
              setTableDialogOpen(true);
            }}
          />
        </StyledBox>
        <StyledBox>
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<ZoomInIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomin")}
            disabled={props.pixelPerMsec === 1 || props.progress}
            onClick={OnZoomIn}
          />
          <EditorButton
            mode={props.mode}
            size={size}
            icon={<ZoomOutIcon sx={{ fontSize: iconSize }} />}
            title={t("editor.zoomout")}
            onClick={OnZoomOut}
            disabled={props.pixelPerMsec === 20 || props.progress}
          />
        </StyledBox>
        <StyledBox>
          <PrevAliasButton
            targetDir={props.targetDir}
            oto={props.oto}
            record={props.record}
            setRecord={props.setRecord}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
            fileIndex={fileIndex}
            aliasIndex={aliasIndex}
            maxFileIndex={maxFileIndex}
            maxAliasIndex={maxAliasIndex}
            setFileIndex={setFileIndex}
            setAliasIndex={setAliasIndex}
            setMaxAliasIndex={setMaxAliasIndex}
            progress={props.progress}
          />
          <NextAliasButton
            targetDir={props.targetDir}
            oto={props.oto}
            record={props.record}
            setRecord={props.setRecord}
            mode={props.mode}
            size={size}
            iconSize={iconSize}
            fileIndex={fileIndex}
            aliasIndex={aliasIndex}
            maxFileIndex={maxFileIndex}
            maxAliasIndex={maxAliasIndex}
            setFileIndex={setFileIndex}
            setAliasIndex={setAliasIndex}
            setMaxAliasIndex={setMaxAliasIndex}
            progress={props.progress}
          />
        </StyledBox>
      </Paper>
      <TableDialog
        dialogOpen={tableDialogOpen}
        setDialogOpen={setTableDialogOpen}
        windowWidth={props.windowWidth}
        windowHeight={props.windowHeight}
        oto={props.oto}
        record={props.record}
        targetDir={props.targetDir}
        updateSignal={0}
        setRecord={props.setRecord}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
        zip={props.zip}
        zipFileName={props.zipFileName}
      />
      <AliasDialog
        dialogOpen={aliasDialogOpen}
        setDialogOpen={setAliasDialogOpen}
        oto={props.oto}
        record={props.record}
        targetDir={props.targetDir}
        setRecord={props.setRecord}
        fileIndex={fileIndex}
        aliasIndex={aliasIndex}
        maxFileIndex={maxFileIndex}
        maxAliasIndex={maxAliasIndex}
        setFileIndex={setFileIndex}
        setAliasIndex={setAliasIndex}
        setMaxAliasIndex={setMaxAliasIndex}
        setUpdateSignal={props.setUpdateSignal}
      />
    </>
  );
};

export interface EditorButtonAreaProps {
  /** 画面の横幅 */
  windowWidth: number;
  /** 画面の縦幅 */
  windowHeight: number;
  /** buttonAreaの高さを通知 */
  setButtonAreaHeight: React.Dispatch<React.SetStateAction<number>>;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** 原音設定データ */
  oto: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在のrecordに関連するwavデータ */
  wav: Wave;
  /** recordを更新する処理 */
  setRecord: React.Dispatch<React.SetStateAction<OtoRecord>>;
  /** 横方向1pixelあたりが何msを表すか */
  pixelPerMsec: number;
  /** 横方向1pixelあたりが何msを表すかを変更する処理 */
  setPixelPerMsec: React.Dispatch<React.SetStateAction<number>>;
  /**ダークモードかライトモードか */
  mode: PaletteMode;
  /** overlaplackを使用するか */
  overlapLock: boolean;
  /** touchmodeを使用するか */
  touchMode: boolean;
  /** overlaplackを使用するかを変更する */
  setOverlapLock: React.Dispatch<React.SetStateAction<boolean>>;
  /** touchmodeを使用するかを変更する */
  setTouchMode: React.Dispatch<React.SetStateAction<boolean>>;
  /** recordの更新をtableに通知するための処理 */
  setUpdateSignal: React.Dispatch<React.SetStateAction<number>>;
  /** zipデータ */
  zip: {
    [key: string]: JSZip.JSZipObject;
  } | null;
  /** zipのファイル名 */
  zipFileName: string;
  /** キャンバスの読込状態 */
  progress: boolean;
}

/**
 * ボタンを格納するためのstyle付Box
 * 縦画面・横画面の自動切り替えを担う
 */
const StyledBox = styled(Box)({
  justifyContent: "space-around",
  display: "flex",
  flexWrap: "wrap",
  flexGrow: 1,
});
