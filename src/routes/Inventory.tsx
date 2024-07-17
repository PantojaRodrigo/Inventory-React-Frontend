import {
  Box,
  Container,
  Grid,
  Input,
  InputAdornment,
  TextField,
} from "@mui/material";
import ItemsTable from "../components/ItemsTable";
import { Link, Outlet, useLoaderData } from "react-router-dom";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { AccountCircle } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Item from "../interfaces/Item";

export default function Inventory() {
  const items = useLoaderData() as Item[];
  return (
    <>
      <Container maxWidth="md">
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          maxWidth="md"
          spacing={1}
          marginY={2}
        >
          <Grid item xs={5} md={7} sx={{ my: "auto" }}>
            <Typography variant="h6" gutterBottom marginY={"auto"}>
              Showing {items.length} items
            </Typography>
          </Grid>
          <Grid item xs={5} md={3} sx={{ my: "auto" }}>
            <TextField
              id="search-input"
              label="Search"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ color: "action.active", ml: -1, my: "auto" }}
                  >
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ marginY: "auto", pl: 0 }}
            />
          </Grid>
          <Grid item>
            <Link to="newItem">
              <Fab color="primary" aria-label="add" size="medium">
                <AddIcon />
              </Fab>
            </Link>
          </Grid>
        </Grid>
        <ItemsTable items={items}></ItemsTable>
      </Container>
    </>
  );
}

export function loader() {
  const response = axios
    .get("http://localhost:8080/items")
    .then((res) => res.data);
  console.log(response);

  return response;
}
