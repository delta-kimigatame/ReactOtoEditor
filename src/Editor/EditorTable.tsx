import * as React from "react";
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

import { styled } from "@mui/system";
import { useTranslation } from "react-i18next";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { layout } from "../settings/setting";

/**
 * 原音設定パラメータを表示するテーブル
 * @param props {@link EditorTableProps}
 * @returns 原音設定パラメータを表示するテーブル
 */
export const EditorTable: React.FC<EditorTableProps> = (props) => {
  const { t } = useTranslation();
  /** tableへのref。heightを取得するために使用 */
  const tableRef = React.useRef(null);
  /** 文字の種類 */
  const [variant, setVariant] = React.useState<"caption" | "body2">("caption");
  /** オフセット */
  const [offset, setOffset] = React.useState<number>(0);
  /** オーバーラップ */
  const [overlap, setOverlap] = React.useState<number>(0);
  /** 先行発声 */
  const [preutter, setPreutter] = React.useState<number>(0);
  /** 子音速度 */
  const [velocity, setVelocity] = React.useState<number>(0);
  /** ブランク */
  const [blank, setBlank] = React.useState<number>(0);

  /**
   * 描画完了時の処理
   * 画面サイズにあわせて文字サイズを変更する。
   */
  React.useEffect(() => {
    if (tableRef !== null && props.setTableHeight) {
      props.setTableHeight(
        Math.max(
          tableRef.current.getBoundingClientRect().height,
          layout.tableMinSize
        )
      );
      if (
        tableRef.current.getBoundingClientRect().width >= layout.tableBrakePoint
      ) {
        setVariant("body2");
      } else {
        setVariant("caption");
      }
    }
  }, []);

  /**
   * 画面サイズ変更時の処理
   * 画面サイズにあわせて文字サイズを変更する。
   */
  React.useEffect(() => {
    if (tableRef !== null && props.setTableHeight) {
      props.setTableHeight(
        Math.max(
          tableRef.current.getBoundingClientRect().height,
          layout.tableMinSize
        )
      );
      if (props.windowWidth >= layout.tableBrakePoint) {
        setVariant("body2");
      } else {
        setVariant("caption");
      }
    }
  }, [props.windowWidth, props.windowHeight]);

  /**
   * 原音設定パラメータが更新された際の処理
   */
  React.useEffect(() => {
    if (props.record !== null) {
      setOffset(props.record.offset);
      setOverlap(props.record.overlap);
      setPreutter(props.record.pre);
      setVelocity(props.record.velocity);
      setBlank(props.record.blank);
    }
  }, [props.record, props.updateSignal]);

  return (
    <>
      <TableContainer component={Paper} ref={tableRef}>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.filename")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.alias")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.offset")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.overlap")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.preutter")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.velocity")}</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>{t("oto.blank")}</Typography>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.oto === undefined ? (
              props.record && (
                <>
                  <TableRow>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {props.record.filename}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {props.record.alias}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {offset.toFixed(3)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {overlap.toFixed(3)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {preutter.toFixed(3)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {velocity.toFixed(3)}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell size={"small"}>
                      <Typography variant={variant}>
                        {blank.toFixed(3)}
                      </Typography>
                    </StyledTableCell>
                  </TableRow>
                </>
              )
            ) : (
              <>
                {props.oto.GetFileNames(props.targetDir).map((f, fi: number) =>
                  props.oto
                    .GetAliases(props.targetDir, f)
                    .map((a, ai: number) => (
                      <TableRow
                        sx={{
                          backgroundColor:
                            props.fileIndex === fi &&
                            props.aliasIndex === ai &&
                            "#fff0f0",
                        }}
                        onClick={() => {
                          props.setRecord(props.oto.GetRecord(props.targetDir, f, a))
                          props.setFileIndex(fi);
                          props.setAliasIndex(ai);
                          props.setMaxAliasIndex(props.oto.GetAliases(props.targetDir, f).length - 1)
                        }}
                      >
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>{f}</Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>{a}</Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>
                            {props.oto
                              .GetRecord(props.targetDir, f, a)
                              .offset.toFixed(3)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>
                            {props.oto
                              .GetRecord(props.targetDir, f, a)
                              .overlap.toFixed(3)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>
                            {props.oto
                              .GetRecord(props.targetDir, f, a)
                              .pre.toFixed(3)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>
                            {props.oto
                              .GetRecord(props.targetDir, f, a)
                              .velocity.toFixed(3)}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell size={"small"}>
                          <Typography variant={variant}>
                            {props.oto
                              .GetRecord(props.targetDir, f, a)
                              .blank.toFixed(3)}
                          </Typography>
                        </StyledTableCell>
                      </TableRow>
                    ))
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export interface EditorTableProps {
  /** 画面の横幅 */
  windowWidth: number;
  /** 画面の縦幅 */
  windowHeight: number;
  /** tableの縦幅を登録する処理 */
  setTableHeight?: React.Dispatch<React.SetStateAction<number>>;
  /** 原音設定データ */
  oto?: Oto;
  /** 現在選択されている原音設定レコード */
  record: OtoRecord | null;
  /** 現在編集対象になっているディレクトリ */
  targetDir: string;
  /** recordの更新通知 */
  updateSignal: number;
  /** recordを更新する処理 */
  setRecord?: React.Dispatch<React.SetStateAction<OtoRecord>>;
  /** 現在のファイルのインデックス */
  fileIndex?: number;
  /** 現在のエイリアスのインデックス */
  aliasIndex?: number;
  /** 現在のファイルのインデックスを変更する処理 */
  setFileIndex?: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のエイリアスのインデックスを変更する処理 */
  setAliasIndex?: React.Dispatch<React.SetStateAction<number>>;
  /** 現在のファイルに登録されているエイリアス数を変更する処理 */
  setMaxAliasIndex?: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * style付きtablecell
 */
const StyledTableCell = styled(TableCell)({
  textWrap: "nowrap",
  p: 1,
  width: "14.2%",
  overflowX: "hidden",
});
