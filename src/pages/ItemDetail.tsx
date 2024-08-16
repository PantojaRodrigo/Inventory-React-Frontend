import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Container, Divider, Stack, CircularProgress } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import { GET_ITEM } from "../queries";
import { useQuery } from "@apollo/client";
import NoItemFound from "../components/NoItemFound";
import ApolloErrorPage from "./ApolloErrorPage";
import styles from "./ItemDetail.module.css";

export default function ItemDetail() {
  console.log("Renderizando...");

  const params = useParams();
  const id = parseInt(params.itemId!);
  const { loading, data, error } = useQuery(GET_ITEM, {
    variables: { id },
  });

  console.log({ loading, data, error: { ...error } });
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

  if (error?.cause?.extensions && typeof error.cause.extensions === "object") {
    const extensions = error.cause.extensions as { [key: string]: any };
    if (extensions.code === "NETWORK_ERROR") {
      return <ApolloErrorPage error={error} />;
    }
  }
  if (!data || data.item === null) {
    return <NoItemFound></NoItemFound>;
  } else {
    const item = data.item;
    return (
      <Container maxWidth="sm" sx={{ width: "100%", mt: 5, justifyContent: "center" }}>
        <Card className={styles.cardContainer} variant="outlined">
          <Box className={styles.header}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              flexWrap={"wrap"}
            >
              <Typography gutterBottom variant="h5" component="div">
                {item.itemName}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                ID:{item.itemId}
              </Typography>
            </Stack>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography className={styles.textPrimary} variant="body2">
              {item.description}
            </Typography>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }} className={styles.locationHeader}>
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="center"
              gap={0.5}
              flexWrap={"wrap"}
            >
              <Typography fontWeight={"bold"} variant="body1">
                LOCATION
              </Typography>
              <Typography fontWeight={"bold"} variant="body1">
                ID: {item.location.locationId}
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }} className={styles.locationBody}>
            <Stack direction="column" gap={1}>
              <Box className={styles.locationInfo}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  Address:
                </Typography>
                <Typography variant="body2">{item.location.address}</Typography>
              </Box>
              <Box className={styles.locationInfo}>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  State:
                </Typography>
                <Typography variant="body2">{item.location.state}</Typography>
              </Box>
              <Box className={styles.locationInfo}>
                <PhoneIcon />
                <Typography gutterBottom variant="body2" fontStyle={"bold"} my="auto">
                  {item.location.phoneNumber}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Card>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%" mt={2}>
          <Link to="/items" style={{ textDecoration: "none" }}>
            <Button className={styles.buttonBack}>Back to inventory</Button>
          </Link>
        </Box>
      </Container>
    );
  }
}
