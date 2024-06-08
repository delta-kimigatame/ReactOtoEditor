import * as React from "react";
import { PaletteMode } from "@mui/material";
import { WavCanvas } from "./WavCanvas";

import { useTranslation } from "react-i18next";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { EditorButtonArea } from "./EditorButtonArea";
import { layout } from "../settings/setting";

export const EditorView: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const [tableHeight, setTableHeight] = React.useState<number>(
    layout.tableMinSize
  );
  const [buttonAreaHeight, setButtonAreaHeight] = React.useState<number>(
    layout.minButtonSize + layout.iconPadding
  );
  const [canvasHeight, setCanvasHeight] = React.useState<number>(
    375 - layout.headerHeight - tableHeight - buttonAreaHeight
  );
  const tableRef = React.useRef(null);
  React.useEffect(() => {
    if (tableRef !== null) {
      setTableHeight(
        Math.max(
          tableRef.current.getBoundingClientRect().height,
          layout.tableMinSize
        )
      );
    }
  }, []);

  React.useEffect(() => {
    setCanvasHeight(
      props.windowSize[1] - layout.headerHeight - tableHeight - buttonAreaHeight
    );
  }, [props.windowSize, tableHeight, buttonAreaHeight]);

  return (
    <>
      <WavCanvas
        canvasSize={[props.windowSize[0], canvasHeight]}
        mode={props.mode}
        color={props.color}
      />
      <TableContainer component={Paper} ref={tableRef}>
        <Table size={"small"}>
          <TableHead>
            <TableRow>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.filename")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.alias")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.offset")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.overlap")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.preutter")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.velocity")}</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">{t("oto.blank")}</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">_ああいあうあえあ.wav</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">- あ</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">1300.000</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">83.333</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">250.000</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">333.333</Typography>
              </TableCell>
              <TableCell
                size={"small"}
                sx={{
                  textWrap: "nowrap",
                  p: 1,
                  width: "14.2%",
                  overflowX: "hidden",
                }}
              >
                <Typography variant="caption">-500.000</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <EditorButtonArea
        windowSize={props.windowSize}
        setButtonAreaHeight={setButtonAreaHeight}
      />
    </>
  );
};

type Props = {
  windowSize: [number, number];
  mode: PaletteMode;
  color: string;
};
