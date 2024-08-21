import { Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Item from "../interfaces/Item";
import React, {useCallback, useState} from "react";
import ItemsTable from "../components/ItemsTable";
import {DELETE_ITEM, GET_FILTERED_ITEMS, GET_ITEMS_WITH_SEARCH} from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import NoItems from "../components/NoItems";
import DeleteDialog from "../components/DeleteDialog";
import InventorySnackbar from "../components/InventorySnackbar";
import InventoryHeader from "../components/InventoryHeader";
import { useSearch } from "../hooks/useSearch";
import { useDeleteItem } from "../hooks/useDeleteItem";
import ApolloErrorPage from "./ApolloErrorPage";

export interface FiltersProps {
  id: string;
  name: string;
  state: string;
}

export default function Inventory() {
  console.log("Renderizando Inventory.tsx...");
  const { searchValue, search } = useSearch();
  const [filters, setFilters] = useState<FiltersProps>({id:"", name:"", state:""})
  const {
    modalOpen,
    snackOpen,
    handleModalClose,
    handleModalOpen,
    handleDeleteItem,
    handleSnackClose,
    error,
  } = useDeleteItem(searchValue);

  let variables: Partial<FiltersProps> = {name: filters.name, state: filters.state};
  try {
    if (parseInt(filters.id)>0) {
      variables = Object.assign(variables, {id: parseInt(filters.id)});
    }
  } catch (e) {
    setFilters((prevState)=>({
      ...prevState,
      id: "",
    }))
  }

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(GET_FILTERED_ITEMS, {
    variables,
    onError: error1 => {
      console.error(error1)
    },
    onCompleted: data => {
      console.log("data"+data)
    }
  });

  if (queryError?.cause?.extensions && typeof queryError.cause.extensions === "object") {
    const extensions = queryError.cause.extensions as { [key: string]: any };
    if (extensions.code === "NETWORK_ERROR") {
      return <ApolloErrorPage error={queryError} />;
    }
  }
  const items: Item[] = queryLoading || !queryData ? [] : queryData.filteredItems;

  return (
    <>
      <Container maxWidth="md">
        <InventoryHeader itemsLength={items.length} queryLoading={queryLoading} filters={filters} setFilters={setFilters} />
      </Container>
      <Container maxWidth="md" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
        {!queryLoading && items.length == 0 ? (
          <NoItems error={queryError} empty={!searchValue}></NoItems>
        ) : (
          <ItemsTable
            items={items}
            handleDeleteItem={handleModalOpen}
            loading={queryLoading}
            filters={filters}
            setFilters={setFilters}
          ></ItemsTable>
        )}
      </Container>
      <InventorySnackbar open={snackOpen} error={error} onClose={handleSnackClose} />
      <DeleteDialog open={modalOpen !== 0} onClose={handleModalClose} onDelete={handleDeleteItem} />
    </>
  );
}
