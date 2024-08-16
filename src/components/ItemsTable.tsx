import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Link, useNavigate } from "react-router-dom";
import Item from "../interfaces/Item.jsx";
import { TableHead, TableSortLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TableRowsLoader from "./TableRowsLoader";
import { visuallyHidden } from "@mui/utils";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ItemsTable.module.css";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}
function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };
  const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };
  const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };
  return (
    <Box sx={{ justifyContent: { xs: "space-between" }, display: "flex", flexShrink: 0, ml: 2 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === "rtl" ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

export default function ItemsTable({
  items,
  handleDeleteItem,
  loading,
}: {
  items: Item[];
  handleDeleteItem: Function;
  loading: boolean;
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Item>("itemId");
  const navigate = useNavigate();
  console.log(">>Renderizando Tabla.tsx");

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property: keyof Item) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedItems = React.useMemo(() => {
    return items.slice().sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, order, orderBy]);

  React.useEffect(() => {
    if (page !== 0 && page === items.length / rowsPerPage) {
      setPage((prevPage) => prevPage - 1);
    }
  }, [items]);

  return (
    <>
      <TableContainer component={Paper} sx={{ overflow: "visible" }}>
        <Table aria-label="custom pagination table" stickyHeader size="small" padding="none">
          <TableHead>
            <TableRow className={styles.tableHeader}>
              <TableCell
                align="center"
                style={{ cursor: "pointer" }}
                sortDirection={orderBy === "itemId" ? order : false}
                sx={{
                  width: {
                    xs: "50px",
                    sm: "10%",
                  },
                  p: 1,
                }}
              >
                <TableSortLabel
                  active={orderBy === "itemId"}
                  direction={orderBy === "itemId" ? order : "asc"}
                  onClick={() => handleRequestSort("itemId")}
                >
                  ID
                  {orderBy === "itemId" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="left"
                style={{ cursor: "pointer" }}
                sortDirection={orderBy === "itemName" ? order : false}
                sx={{ p: 1 }}
              >
                <TableSortLabel
                  active={orderBy === "itemName"}
                  direction={orderBy === "itemName" ? order : "asc"}
                  onClick={() => handleRequestSort("itemName")}
                >
                  Name
                  {orderBy === "itemName" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell
                align="left"
                style={{ cursor: "pointer" }}
                sortDirection={orderBy === "description" ? order : false}
                sx={{
                  display: { xs: "none", sm: "table-cell" },
                }}
              >
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={() => handleRequestSort("description")}
                >
                  Description
                  {orderBy === "description" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ width: 56 }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRowsLoader rowsNum={5} />
            ) : (
              (rowsPerPage > 0
                ? sortedItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : sortedItems
              ).map((item, index) => (
                <TableRow
                  key={item.itemId}
                  className={styles.tableRow}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell
                    sx={{ px: 1 }}
                    onClick={() => navigate(`${item.itemId}`)}
                    align="center"
                  >
                    {item.itemId}
                  </TableCell>
                  <TableCell sx={{ px: 1 }} onClick={() => navigate(`${item.itemId}`)} align="left">
                    {item.itemName}
                  </TableCell>
                  <TableCell
                    sx={{ display: { xs: "none", sm: "table-cell" } }}
                    onClick={() => navigate(`${item.itemId}`)}
                    align="left"
                  >
                    {item.description}
                  </TableCell>
                  <TableCell align="right" sx={{ width: 80 }}>
                    <Link to={`/items/${item.itemId}/newItem`}>
                      <IconButton aria-label="update" className={styles.rotateOnHover}>
                        <EditIcon />
                      </IconButton>
                    </Link>

                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteItem(item.itemId)}
                      className={styles.shakeOnHover}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}

            {emptyRows > 0 && (
              <TableRow style={{ height: 40.67 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                sx={{ pl: 0 }}
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={4}
                count={items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "items per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
