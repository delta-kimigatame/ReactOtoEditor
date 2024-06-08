import * as React from "react";
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

export const EditorTable: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const tableRef = React.useRef(null);
  const [variant, setVariant] = React.useState<"caption" | "body2">("caption");
  React.useEffect(() => {
    if (tableRef !== null) {
      props.setTableHeight(
        Math.max(
          tableRef.current.getBoundingClientRect().height,
          layout.tableMinSize
        )
      );
      if (tableRef.current.getBoundingClientRect().width >= layout.tableBrakePoint) {
        setVariant("body2");
      } else {
        setVariant("caption");
      }
    }
  }, []);

  React.useEffect(() => {
    if (tableRef !== null) {
      props.setTableHeight(
        Math.max(
          tableRef.current.getBoundingClientRect().height,
          layout.tableMinSize
        )
      );
      if (props.windowSize[0] >= layout.tableBrakePoint) {
        setVariant("body2");
      } else {
        setVariant("caption");
      }
    }
  }, [props.windowSize]);
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
            <TableRow>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>_ああいあうあえあ.wav</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>- あ</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>1300.000</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>83.333</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>250.000</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>333.333</Typography>
              </StyledTableCell>
              <StyledTableCell size={"small"}>
                <Typography variant={variant}>-500.000</Typography>
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

type Props = {
  windowSize: [number, number];
  setTableHeight: React.Dispatch<React.SetStateAction<number>>;
};

const StyledTableCell = styled(TableCell)({
  textWrap: "nowrap",
  p: 1,
  width: "14.2%",
  overflowX: "hidden",
});
