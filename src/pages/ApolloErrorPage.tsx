import { ApolloError } from "@apollo/client";
import { Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function ApolloErrorPage({ error }: { error: ApolloError }) {
  let title = "An error ocurred";
  let message = "Something went wrong!";
  let networkMessage = <></>;
  if (error.networkError) {
    title = "There was a problem connecting to the server";
    message = error.networkError.message;
  }
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    message = "";
    if (error.graphQLErrors[0].message === "[object Object]") {
      networkMessage = <p>There was an error connecting with the server</p>;
    } else {
      networkMessage = (
        <div>
          {error.graphQLErrors.map((err, index) => (
            <p key={index}>{err.message}</p>
          ))}
        </div>
      );
    }
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
          {networkMessage}
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
