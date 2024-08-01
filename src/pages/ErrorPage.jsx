import { Container, Typography, Button, Stack } from "@mui/material";
import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "An error ocurred";
  let message = "Something went wrong!";

  if (error.status && error.status === 500) {
    message = error.data.message;
  }
  if (error.status && error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  } else {
    message = error.message;
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
        <Link to="/items">
          <Button variant="contained" color="primary">
            Go to Inventory
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
