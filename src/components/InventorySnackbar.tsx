import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { ApolloError } from "@apollo/client";

interface InventorySnackbarProps {
  open: boolean;
  error?: ApolloError;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}

const InventorySnackbar: React.FC<InventorySnackbarProps> = ({
  open,
  error,
  onClose,
}) => (
  <Snackbar
    open={open}
    autoHideDuration={2000}
    onClose={onClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert
      onClose={onClose}
      severity={error ? "error" : "success"}
      sx={{ width: "100%" }}
    >
      {error ? `${error.message}` : "Item deleted!"}
    </Alert>
  </Snackbar>
);

export default InventorySnackbar;
