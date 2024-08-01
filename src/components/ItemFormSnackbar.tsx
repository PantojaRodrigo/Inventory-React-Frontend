import React from "react";
import { Alert, Snackbar } from "@mui/material";

interface ItemFormSnackbarProps {
  snackOpen: boolean;
  handleSnackClose: (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => void;
}

const ItemFormSnackbar: React.FC<ItemFormSnackbarProps> = ({
  snackOpen,
  handleSnackClose,
}) => (
  <Snackbar
    open={snackOpen}
    autoHideDuration={3000}
    onClose={handleSnackClose}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
  >
    <Alert onClose={handleSnackClose} severity="success" sx={{ width: "100%" }}>
      Item added successfully!
    </Alert>
  </Snackbar>
);

export default React.memo(ItemFormSnackbar);
