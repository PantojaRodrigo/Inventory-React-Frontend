import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Snackbar,
} from "@mui/material";
import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  useActionData,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Item from "../interfaces/Item";
import React from "react";
import ItemsTable from "../components/ItemsTable";
import SearchField from "../components/SearchField";

export default function Inventory() {
  const items = useLoaderData() as Item[];
  const res = useActionData() as Response;
  const [modalOpen, setModalOpen] = React.useState(0);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const navigate = useNavigate();

  let sts = 0;
  if (res !== undefined) sts = res.status;

  function handleModalClose() {
    setModalOpen(0);
  }
  function handleModalOpen(itemId: number) {
    setModalOpen(itemId);
  }
  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };
  React.useEffect(() => {
    if (modalOpen !== 0) {
      console.log("   Cerrando Modal...");
      handleModalClose();
      setSnackOpen(true);
    }
  }, [items]);

  //console.log("Renderizando inventory...");
  const search = (str: string) => {
    navigate("/items?search=" + str);
  };
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
            <SearchField searchFn={search}></SearchField>
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
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={sts > 299 ? "error" : "success"}
          //variant="outlined"
          sx={{ width: "100%" }}
        >
          {sts > 299 ? "Operation failed" : "Item deleted!"}
        </Alert>
      </Snackbar>
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
            <Button autoFocus variant="contained" type="submit">
              Yes
            </Button>
          </Form>
        </DialogActions>
      </Dialog>
    </>
  );
}

export const loader: LoaderFunction = async ({ request, params }) => {
  console.log("   Recibiendo inventario...");
  const search = new URL(request.url).searchParams.get("search");
  let searchState = "";
  if (search) searchState = "?state=" + search;

  try {
    const response = await fetch("http://localhost:8080/items" + searchState);
    if (!response.ok) {
      throw json({ message: "Error loading the inventory" }, { status: 500 });
    }
    return response;
  } catch (error) {
    console.log("   Error al enviar request...");
    throw json({ message: "Error loading the inventory" }, { status: 500 });
  }
};
export const action: ActionFunction = async ({ request, params }) => {
  //console.log("   Recibiendo form...");

  const formData = await request.formData();
  const itemId = formData.get("itemId");
  //console.log("   Enviando delete...");
  const url = "http://localhost:8080/items/" + itemId;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    return response;
  } catch (error) {
    throw json({ message: "Error al mandar la solicitud" }, { status: 500 });
  }
};
