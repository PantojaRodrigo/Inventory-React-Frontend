import { Skeleton, TableCell, TableRow } from "@mui/material";

const TableRowsLoader = ({ rowsNum }: { rowsNum: number }) => {
  return (
    <>
      {[...Array(rowsNum)].map((row, index) => (
        <TableRow key={index} sx={{ height: 53 }}>
          <TableCell component="th" scope="row">
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
          <TableCell>
            <Skeleton animation="wave" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
export default TableRowsLoader;
