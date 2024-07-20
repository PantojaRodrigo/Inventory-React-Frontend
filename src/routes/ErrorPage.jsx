import React from "react";
import { Container, Typography, Button, Box, Stack } from "@mui/material";
import { redirect, useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/items");
  };
  let title = "An error ocurred";
  let message = "Something went wrong!";

  if (error.status === 500) {
    message = error.data.message;
  }
  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  const containerSx = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
  };
  return (
    <Container sx={containerSx} maxWidth="sm">
      <Stack gap={2}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="h5" color="text.secondary">
          {message}
        </Typography>
        <Box>
          <Button variant="contained" color="primary" onClick={handleGoBack}>
            Go to Inventory
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
