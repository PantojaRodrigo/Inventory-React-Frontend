import { Alert, Box, Button, Container, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { Form, useNavigate, useParams } from "react-router-dom";
import Item from "../interfaces/Item";
import LoadingButton from "@mui/lab/LoadingButton";

import { useAddItem, useUpdateItem } from "../hooks/useItemMutations";
import { useFormHandlers } from "../hooks/useFormHandlers";
import ItemFormSnackbar from "./ItemFormSnackbar";
import ItemFormDialog from "./ItemFormDialog";
import FormFields from "./FormFields";
import ApolloErrorPage from "../pages/ApolloErrorPage";

interface ErrorMap {
  [key: string]: string;
}
export default function ItemForm({
  method,
  item,
}: {
  method: string;
  item: Item | null;
}) {
  const params = useParams();
  const navigate = useNavigate();
  const { addItem, addError, addLoading } = useAddItem(() => {
    setSnackOpen(true);
    handleModalOpen();
  });
  const { updateItem, updateError, updateLoading } = useUpdateItem(item, () => {
    navigate(`/items/${item!.itemId}`);
  });

  const {
    errors,
    modalOpen,
    snackOpen,
    form,
    handleSnackClose,
    handleModalClose,
    handleModalOpen,
    handleSubmitForm,
    setSnackOpen,
  } = useFormHandlers(item, method, addItem, updateItem);

  if (addError?.networkError || updateError?.networkError) {
    return (
      <ApolloErrorPage
        error={addError ? addError! : updateError!}
      ></ApolloErrorPage>
    );
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
          <Typography component="h1" variant="h5" mb={1}>
            {method === "PATCH" && item !== null
              ? "Update Item"
              : "Create New Item"}
          </Typography>
          <Form noValidate ref={form} onSubmit={handleSubmitForm}>
            {addError !== undefined && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {addError.message}
              </Alert>
              //<Typography sx={{ pb: 3 }}>{addError.message}</Typography>
            )}
            {updateError !== undefined && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {updateError.message}
              </Alert>
            )}
            <FormFields item={item} errors={errors} />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={method === "POST" ? addLoading : updateLoading}
            >
              {method === "PATCH" ? "Update" : "Add"} item
            </LoadingButton>
          </Form>
        </Box>
      </Container>
      <ItemFormDialog
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
      />
      <ItemFormSnackbar
        snackOpen={snackOpen}
        handleSnackClose={handleSnackClose}
      />
    </>
  );
}
