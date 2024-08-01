import React from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { Link } from "react-router-dom";

interface ItemFormDialogProps {
  modalOpen: boolean;
  handleModalClose: () => void;
}

const ItemFormDialog: React.FC<ItemFormDialogProps> = ({
  modalOpen,
  handleModalClose,
}) => (
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
);

export default React.memo(ItemFormDialog);
