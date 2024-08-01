import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title">
      {"Are you sure you want to delete this item?"}
    </DialogTitle>
    <DialogActions>
      <Button onClick={onClose} variant="outlined">
        No
      </Button>
      <Button autoFocus variant="contained" onClick={onDelete}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
);

export default DeleteDialog;
