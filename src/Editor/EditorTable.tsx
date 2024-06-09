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
import { Oto } from "utauoto";
import OtoRecord from "utauoto/dist/OtoRecord";

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
      if (
        tableRef.current.getBoundingClientRect().width >= layout.tableBrakePoint
      ) {
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
            {props.oto === undefined ? props.record && (
              <>
                <TableRow>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>
                      {props.record.filename}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.alias}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.offset.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.overlap.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.pre.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.velocity.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.record.blank.toFixed(3)}</Typography>
                  </StyledTableCell>
                </TableRow>
              </>
            ) : (
              <>{props.oto.GetFileNames(props.targetDir).map(f=>(
                props.oto.GetAliases(props.targetDir,f).map(a=>(
                  <TableRow>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>
                      {f}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{a}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.oto.GetRecord(props.targetDir,f,a).offset.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.oto.GetRecord(props.targetDir,f,a).overlap.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.oto.GetRecord(props.targetDir,f,a).pre.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.oto.GetRecord(props.targetDir,f,a).velocity.toFixed(3)}</Typography>
                  </StyledTableCell>
                  <StyledTableCell size={"small"}>
                    <Typography variant={variant}>{props.oto.GetRecord(props.targetDir,f,a).blank.toFixed(3)}</Typography>
                  </StyledTableCell>
                </TableRow>
                ))
              ))}</>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

type Props = {
  windowSize: [number, number];
  setTableHeight: React.Dispatch<React.SetStateAction<number>>;
  oto?: Oto;
  record: OtoRecord | null;
  targetDir:string
};

const StyledTableCell = styled(TableCell)({
  textWrap: "nowrap",
  p: 1,
  width: "14.2%",
  overflowX: "hidden",
});
