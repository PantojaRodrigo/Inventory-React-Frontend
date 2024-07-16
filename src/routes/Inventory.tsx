import { Container } from "@mui/material";
import ItemsTable from "../components/ItemsTable";
import { Outlet } from "react-router-dom";
import axios from "axios";
export default function Inventory() {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{ mt: 5, fontWeight: "bold", typography: "title" }}
      >
        Titulos
      </Container>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <ItemsTable></ItemsTable>
      </Container>
    </>
  );
}

export function loader() {
  const response = axios
    .get("http://localhost:8080/items")
    .then((res) => res.data);
  console.log(response);

  return response;
}
