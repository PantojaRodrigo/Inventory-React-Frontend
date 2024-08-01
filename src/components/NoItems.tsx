import { Box, Container, Typography } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import { ApolloError } from "@apollo/client";

export default function NoItems({
  empty,
  error,
}: {
  empty: boolean;
  error: ApolloError | undefined;
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: "10vh",
        textAlign: "center",
      }}
    >
      <Box>
        <SentimentDissatisfiedIcon sx={{ fontSize: 80, color: "gray" }} />
      </Box>
      <Box mt={2}>
        {error && (
          <Typography variant="h5" component="div" gutterBottom>
            {error.message}
          </Typography>
        )}
        {!error && (
          <Typography variant="h5" component="div" gutterBottom>
            No items found
          </Typography>
        )}
        {!empty && (
          <>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filter to find what you are looking
              for.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ pt: 2 }}>
              You can filter items by name, description or state.
            </Typography>
          </>
        )}
      </Box>
    </Container>
  );
}
