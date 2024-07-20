import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { json, Params, useLoaderData, useNavigate } from "react-router-dom";
import Item from "../interfaces/Item";
import {
  Button,
  Card,
  Chip,
  Container,
  Divider,
  Icon,
  Paper,
  Stack,
} from "@mui/material";
import type { LoaderFunction } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";

export default function ItemDetail() {
  const item = useLoaderData() as Item;
  const navigate = useNavigate();
  return (
    <Container sx={{ width: "100%", maxWidth: 500, mt: 5 }}>
      <Card variant="outlined" sx={{ maxWidth: 360 }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography gutterBottom variant="h5" component="div">
              {item.itemName}
            </Typography>
            <Typography gutterBottom variant="h6" component="div">
              ID:{item.itemId}
            </Typography>
          </Stack>
          <Typography color="text.primary" variant="body2">
            {item.description}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Stack direction="column" gap={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">Location:</Typography>
              <Typography variant="body1">
                ID: {item.location.locationId}
              </Typography>
            </Stack>
            <Box display="flex" gap={1}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Address:
              </Typography>
              <Typography variant="body2">{item.location.address}</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                State:
              </Typography>
              <Typography variant="body2">{item.location.state}</Typography>
            </Box>
            <Box display="flex" gap={1}>
              <PhoneIcon></PhoneIcon>
              <Typography
                gutterBottom
                variant="body2"
                fontStyle={"bold"}
                my="auto"
              >
                {item.location.phoneNumber}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Card>
      <Box alignItems="flex-end">
        <Button onClick={() => navigate("/items")} autoFocus>
          Back to inventory
        </Button>
      </Box>
    </Container>
  );
}

export const loader: LoaderFunction = ({ request, params }) => {
  const id = params.itemId;
  const data = axios
    .get("http://localhost:8080/items/" + id)
    .then((res) => res.data)
    .catch(function (error) {
      if (error.request) {
        console.log("   Error al enviar request...");
        throw json(
          { message: "Could not find resource or page." },
          { status: 500 }
        );
      }
      return error.response;
    });
  return data;
  //TODO ERROR HANDLING
};
