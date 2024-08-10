import { Grid, TextField } from "@mui/material";
import React, { useCallback } from "react";
import Item from "../interfaces/Item";

interface FormFieldsProps {
  item: Item | null;
  errors: { [key: string]: string } | null;
}

const FormFields: React.FC<FormFieldsProps> = ({ item, errors }) => {
  const hasErrors = useCallback(
    (field: string): boolean => {
      return Boolean(errors?.[field]);
    },
    [errors]
  );
  return (
    <Grid container spacing={2} mt={1}>
      <Grid item xs={12} sm={4}>
        <TextField
          name="id"
          id="id"
          label="ID"
          required
          fullWidth
          autoFocus
          type="number"
          onKeyDown={(evt) =>
            ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
          }
          inputProps={{ min: 1, "aria-label": "ID" }}
          defaultValue={item?.itemId}
          disabled={item !== null}
          error={hasErrors("id")}
          helperText={hasErrors("id") ? errors!.id : ""}
        />
        <input type="hidden" name="id" value={item?.itemId} readOnly />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          required
          fullWidth
          id="itemName"
          inputProps={{ "aria-label": "Item Name" }}
          label="Item Name"
          name="itemName"
          defaultValue={item?.itemName}
          error={hasErrors("itemName")}
          helperText={hasErrors("itemName") ? errors!.itemName : ""}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          id="description"
          label="Item Description"
          inputProps={{ "aria-label": "Item Description" }}
          name="description"
          autoComplete="description"
          defaultValue={item?.description}
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
          onKeyDown={(evt) =>
            ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
          }
          inputProps={{ min: 1, "aria-label": "Location ID" }}
          defaultValue={item?.location.locationId}
          error={hasErrors("locationId")}
          helperText={hasErrors("locationId") ? errors!.locationId : ""}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <TextField
          required
          fullWidth
          id="state"
          label="State"
          inputProps={{ "aria-label": "State" }}
          name="state"
          defaultValue={item?.location.state}
          error={hasErrors("state")}
          helperText={hasErrors("state") ? errors!.state : ""}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="address"
          label="Address"
          inputProps={{ "aria-label": "Address" }}
          id="address"
          defaultValue={item?.location.address}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          name="number"
          label="Phone number"
          inputProps={{
            "aria-label": "Phone number",
          }}
          id="number"
          type="number"
          onKeyDown={(evt) =>
            ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()
          }
          defaultValue={item?.location.phoneNumber}
          error={hasErrors("phoneNumber")}
          helperText={hasErrors("phoneNumber") ? errors!.phoneNumber : ""}
        />
      </Grid>
    </Grid>
  );
};
export default React.memo(FormFields);
