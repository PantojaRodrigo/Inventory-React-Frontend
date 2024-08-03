import { useQuery } from "@apollo/client";
import ItemForm from "../components/ItemForm";
import { useParams, json } from "react-router-dom";
import { GET_ITEM } from "../queries";
import { Container, CircularProgress, Box } from "@mui/material";
import NoItemFound from "../components/NoItemFound";
import ApolloErrorPage from "./ApolloErrorPage";

export default function UpdateItem() {
  const params = useParams();
  const id = parseInt(params.itemId!);
  const { loading, data, error } = useQuery(GET_ITEM, {
    variables: { id },
  });
  if (loading) {
    return (
      <>
        <Box
          sx={{
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        ></Box>
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
  let item = null;
  if (data && data.item) {
    item = data.item;
    return <ItemForm method="PATCH" item={item}></ItemForm>;
  } else return <NoItemFound></NoItemFound>;
}
