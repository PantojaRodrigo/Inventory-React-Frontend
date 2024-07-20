import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Snackbar,
} from "@mui/material";
import {
  ActionFunction,
  Form,
  json,
  Link,
  useActionData,
  useNavigate,
} from "react-router-dom";
import axios, { AxiosResponse } from "axios";
import Item, { Location } from "../interfaces/Item";
interface ErrorMap {
  [key: string]: string;
}
interface ResponseCust {
  modal: boolean;
  errors: ErrorMap;
  response: AxiosResponse | void;
}
export default function NewItem() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const actionData = useActionData() as ResponseCust | undefined;
  const { modal = false, errors = {}, response = undefined } = actionData || {};
  const [openSnack, setOpenSnack] = React.useState(false);
  const form = React.useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  console.log("Rendering newItem.tsx");
  console.log(response?.status);

  React.useEffect(() => {
    if (response && response.status == 201) {
      setOpenSnack(true);
    }
    if (modal) {
      handleModalOpen();
    }
  }, [actionData]);

  function handleModalOpen() {
    setModalOpen(true);
  }
  function handleModalClose() {
    form.current?.reset();
    setModalOpen(false);
  }

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnack(false);
  };
  function validateItem(item: any) {
    console.log("item id" + typeof item.id);
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formDataObj: { [key: string]: FormDataEntryValue } = {};
    data.forEach((value, key) => {
      formDataObj[key] = value;
    });

    validateItem(formDataObj);
    if (errors) handleModalOpen();
  };

  //console.log("errors: " + JSON.stringify(errors, null, 2));
  function hasErrors(field: string): boolean {
    if (errors === undefined || errors === null) return false;
    if (
      errors[field] === undefined ||
      errors[field] === null ||
      errors[field] === ""
    )
      return false;

    return true;
  }
  return (
    <>
      <Box>
        <Button onClick={() => navigate("/items")} autoFocus>
          Back to inventory
        </Button>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5" mb={4}>
            Create New Item
          </Typography>
          <Form noValidate method="POST" ref={form}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="id"
                  required
                  fullWidth
                  id="id"
                  label="ID"
                  autoFocus
                  type="number"
                  inputProps={{ min: 1 }}
                  error={hasErrors("id")}
                  helperText={hasErrors("id") ? errors.id : ""}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="itemName"
                  label="Item Name"
                  name="itemName"
                  error={hasErrors("itemName")}
                  helperText={hasErrors("itemName") ? errors.itemName : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  label="Item Description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  name="locationId"
                  required
                  fullWidth
                  id="locationId"
                  label="Location ID"
                  type="number"
                  inputProps={{ min: 1 }}
                  error={hasErrors("locationId")}
                  helperText={hasErrors("locationId") ? errors.locationId : ""}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
                  error={hasErrors("state")}
                  helperText={hasErrors("state") ? errors.state : ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="Address"
                  id="address"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="number"
                  label="Phone number"
                  id="number"
                  type="number"
                />
              </Grid>
            </Grid>
            {response !== undefined && response.status === 400 && (
              <List>
                {Object.entries(errors).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText
                      primary={key}
                      secondary={value}
                    ></ListItemText>
                  </ListItem>
                ))}
              </List>
            )}
            {response !== undefined && response.status === 409 && (
              <p>{response.data}</p>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add item
            </Button>
          </Form>
        </Box>
      </Container>

      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do you want to keep adding items?"}
        </DialogTitle>

        <DialogActions>
          <Link to="/items">
            <Button autoFocus>No, go to inventory</Button>
          </Link>
          <Button onClick={handleModalClose} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnack}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          //variant="filled"
          sx={{ width: "100%" }}
        >
          Item added successful!
        </Alert>
      </Snackbar>
    </>
  );
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const errors = validateForm(formData);
  if (Object.keys(errors).length)
    return { modal: false, errors, response: undefined };

  const itemLocation: Location = {
    locationId: formData.get("locationId") as unknown as number,
    state: formData.get("state")?.toString().trim() as string,
    address: formData.get("address")?.toString().trim() as string,
    phoneNumber: formData.get("number") as unknown as number,
  };
  const item: Item = {
    itemId: formData.get("id") as unknown as number,
    itemName: formData.get("itemName")?.toString().trim() as string,
    description: formData.get("description")?.toString().trim() as string,
    location: itemLocation,
  };

  let modal = true;
  const url = "http://localhost:8080/items";

  let response = await axios
    .post(url, item, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch(function (error) {
      if (error.response) {
        modal = false;
        response = error.response;
      } else if (error.request) {
        modal = false;
        throw json(
          { message: "Error sending the request to add the Item" },
          { status: 500 }
        );
      } else {
      }
    });

  const responseCust: ResponseCust = {
    modal,
    errors,
    response,
  };
  return responseCust;
};

function validateId(id: string, field: string): string | null {
  if (id === "") return field + " is required";
  if (+id < 1) return field + " must be positive";
  if (Math.floor(+id) !== +id) return field + " must be integer";
  return null;
}
function validateForm(formData: FormData): ErrorMap {
  const errors: ErrorMap = {};
  const errorId = validateId(formData.get("id") as string, "ID");
  if (errorId) errors.id = errorId;

  if (formData.get("itemName")?.toString().trim() === "")
    errors.itemName = "Item Name is required";
  const errorLocId = validateId(
    formData.get("locationId") as string,
    "Location ID"
  );
  if (errorLocId) errors.locationId = errorLocId;
  if (formData.get("state")?.toString().trim() === "")
    errors.state = "State is required";
  return errors;
}
