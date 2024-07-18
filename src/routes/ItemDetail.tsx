import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Params, useLoaderData } from "react-router-dom";
import Item from "../interfaces/Item";
import { Container } from "@mui/material";
import type { LoaderFunction } from "react-router-dom";

export default function ItemDetail() {
  const item = useLoaderData() as Item;
  return (
    <Container sx={{ width: "100%", maxWidth: 500, mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        {item.itemName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        ID:{item.itemId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {item.description}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Location:
      </Typography>
      <Typography variant="body1" gutterBottom>
        Location ID: {item.location.locationId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        State: {item.location.state}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Number: {item.location.phoneNumber}
      </Typography>
    </Container>
  );
}

export const loader: LoaderFunction = ({ request, params }) => {
  const id = params.itemId;
  const data = axios
    .get("http://localhost:8080/items/" + id)
    .then((res) => res.data);
  return data;
  //TODO ERROR HANDLING
};
