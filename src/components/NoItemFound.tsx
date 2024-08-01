import { Container, Stack, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NoItemFound() {
  return (
    <Container maxWidth="sm">
      <Stack gap={2} alignItems="left" mx="auto" mt={5}>
        <Typography variant="h4">{"Error"}</Typography>
        <Typography variant="h5" color="text.secondary">
          {"Item not found"}
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
