import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Divider,
  Stack,
  CircularProgress,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { GET_ITEM } from "../queries";
import { useQuery } from "@apollo/client";
import NoItemFound from "../components/NoItemFound";
import ApolloErrorPage from "./ApolloErrorPage";

export default function ItemDetail() {
  console.log("Renderizando...");

  const params = useParams();
  const id = parseInt(params.itemId!);
  const { loading, data, error } = useQuery(GET_ITEM, {
    variables: { id },
  });

  if (loading) {
    return (
      <>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress sx={{ my: "auto" }} />
        </Container>
      </>
    );
  }
  if (error?.networkError) {
    return <ApolloErrorPage error={error}></ApolloErrorPage>;
  }
  if (data && data.item) {
    const item = data.item;
    return (
      <Container
        sx={{ width: "100%", maxWidth: 500, mt: 5, justifyContent: "center" }}
      >
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
          <Link to="/items">
            <Button autoFocus>Back to inventory</Button>
          </Link>
        </Box>
      </Container>
    );
  } else {
    return <NoItemFound></NoItemFound>;
  }
}
