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
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import Item from "../interfaces/Item";
import React, { useCallback } from "react";
import ItemsTable from "../components/ItemsTable";
import SearchField from "../components/SearchField";
import { DELETE_ITEM, GET_ITEMS_WITH_SEARCH } from "../queries";
import client from "../client";
import { useMutation, useQuery } from "@apollo/client";
import NoItems from "../components/NoItems";
import { GraphQLFormattedError } from "graphql";

export default function Inventory() {
  console.log("Renderizando Inventory.tsx...");
  const searchStr = useLocation().search;
  const searchValue = new URLSearchParams(searchStr).get("search");
  const [modalOpen, setModalOpen] = React.useState(0);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const navigate = useNavigate();

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(GET_ITEMS_WITH_SEARCH, {
    variables: { search: searchValue },
  });
  console.log("errors: " + queryError?.message);

  const [deleteItem, { error }] = useMutation(DELETE_ITEM, {
    refetchQueries: [
      { query: GET_ITEMS_WITH_SEARCH, variables: { search: searchValue } },
    ],
    onCompleted: (data) => {
      setSnackOpen(true);
    },
    update: (cache, { data: { deleteItem } }) => {
      const existingItems = cache.readQuery({
        query: GET_ITEMS_WITH_SEARCH,
        variables: { search: searchValue },
      }) as { items: Item[] };
      console.log("updatE!!!!");

      const newItems = existingItems.items.filter(
        (item) => item.itemId !== modalOpen
      );
      cache.writeQuery({
        query: GET_ITEMS_WITH_SEARCH,
        data: { items: newItems },
        variables: { search: searchValue },
      });
    },
    optimisticResponse: {
      deleteItem: {
        __typename: "Item",
        itemId: null,
        itemName: null,
      },
    },
  });
  let items = [];
  if (!queryLoading) {
    items = queryData.items;
  }

  //const errors = useActionData() as GraphQLFormattedError[];

  function handleModalClose() {
    setModalOpen(0);
  }
  function handleModalOpen(itemId: number) {
    setModalOpen(itemId);
  }
  function handleDeleteITem() {
    deleteItem({ variables: { id: modalOpen } });
    setModalOpen(0);
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
  /* React.useEffect(() => {
    if (modalOpen !== 0) {
      console.log("   Cerrando Modal...");
      handleModalClose();
      setSnackOpen(true);
    }
  }, [items]); */

  const search = useCallback((str: string) => {
    navigate("/items?search=" + str);
    console.log("Searching...");
  }, []);

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
        {items.length == 0 && !queryLoading ? (
          <NoItems empty={searchValue == null || searchValue == ""}></NoItems>
        ) : (
          <ItemsTable
            items={items}
            handleDeleteItem={handleModalOpen}
            loading={queryLoading}
          ></ItemsTable>
        )}
      </Container>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity={error !== undefined ? "error" : "success"}
          //variant="outlined"
          sx={{ width: "100%" }}
        >
          {error !== undefined ? `${error.message}` : "Item deleted!"}
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

          {/* <Form method="delete" replace>
            <input name="itemId" defaultValue={modalOpen} hidden />
            <Button autoFocus variant="contained" type="submit">
              Yes
            </Button>
          </Form> */}
          <Button autoFocus variant="contained" onClick={handleDeleteITem}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/* export const loader: LoaderFunction = async ({ request, params }) => {
  const search = new URL(request.url).searchParams.get("search");

  const { data } = await client.query({
    query: GET_ITEMS_WITH_SEARCH,
    variables: {
      search,
    },
  });
  console.log("   Inventario recibido...");
  return data;
}; */

/* export const action: ActionFunction = async ({ request, params }) => {
  console.log("   Recibiendo form...");

  const formData = await request.formData();
  const itemId = formData.get("itemId") as string;
  const id = parseInt(itemId);
  console.log("   Enviando delete...");
  const { data, errors } = await client.mutate({
    mutation: DELETE_ITEM,
    variables: {
      id: id,
    },
  });
  console.log(data);
  if (errors === undefined) return null;
  return errors;
}; */
