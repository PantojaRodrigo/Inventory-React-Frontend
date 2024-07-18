import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import ItemsTable from "../components/ItemsTable";
import {
  ActionFunction,
  Form,
  Link,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import SearchIcon from "@mui/icons-material/Search";
import Item from "../interfaces/Item";
import React from "react";

export default function Inventory() {
  const items = useLoaderData() as Item[];
  const data = useActionData();
  //console.log("Data: " + data);

  const [modalOpen, setModalOpen] = React.useState(0);

  function handleModalClose() {
    setModalOpen(0);
  }
  function handleModalOpen(itemId: number) {
    setModalOpen(itemId);
  }

  React.useEffect(() => {
    /* if (response && response.status == 200) {
      setOpenSnack(true);
    } */
    if (modalOpen !== 0) {
      console.log("   Cerrando Modal...");

      handleModalClose();
    }
  }, [data]);

  console.log("Renderizando inventory...");

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
          <Grid item xs={5} md={3} sx={{ my: "auto" }} minWidth={50}>
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
        <ItemsTable
          items={items}
          handleModalOpen={handleModalOpen}
        ></ItemsTable>
      </Container>
      <Dialog
        open={modalOpen !== 0}
        onClose={handleModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Are you sure you want to delete this item?"}
        </DialogTitle>

        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            No
          </Button>

          <Form method="delete" replace>
            <input name="itemId" defaultValue={modalOpen} hidden />
            <Button
              //onClick={() => handleDeleteItem(modalOpen)}
              autoFocus
              variant="contained"
              type="submit"
            >
              Yes
            </Button>
          </Form>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function loader() {
  console.log("   Recibiendo inventario...");
  const response = axios
    .get("http://localhost:8080/items")
    .then((res) => res.data);

  return response;
}
export const action: ActionFunction = async ({ request, params }) => {
  console.log("   Recibiendo form...");

  const formData = await request.formData();
  const itemId = formData.get("itemId");
  console.log("   Enviando delete...");
  const url = "http://localhost:8080/items/" + itemId;
  let response = axios
    .delete(url)
    .then((res) => res.data)
    .catch(function (error) {
      if (error.response) {
        return error.response;
      } else if (error.request) {
        return error.request;
      } else {
        return error.message;
      }
      //console.log(error.config);
    });
  console.log("   Delete completado...");
  return response;
};
