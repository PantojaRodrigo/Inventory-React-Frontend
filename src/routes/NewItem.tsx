import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
interface ErrorMap {
  [key: string]: string;
}
export default function NewItem() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<ErrorMap>({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  console.log("LOOL");

  function handleModalOpen() {
    setModalOpen(true);
  }
  function handleModalClose() {
    setModalOpen(false);
  }
  function validateItem(item: any) {
    console.log("item id" + typeof item.id);

    if (item.id === "") {
      setErrors((prevErr) => ({
        ...prevErr,
        id: "ID is required",
      }));
    } else if (item.id && item.id < 1) {
      setErrors((prevErr) => ({
        ...prevErr,
        id: "ID must be positive",
      }));
    } else if (item.id && Math.floor(item.id) !== parseFloat(item.id)) {
      console.log("EEE");
      setErrors((prevErr) => ({
        ...prevErr,
        id: "ID must be an integer",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        id: "",
      }));
    }
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
  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Create New Item
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
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
                  error={errors["id"] !== undefined}
                  helperText={errors["id"]}
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="itemName"
                  label="Item Name"
                  name="itemName"
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
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State"
                  name="state"
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
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add item
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog
        fullScreen={fullScreen}
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
    </>
  );
}
