import { Container } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Item from "../interfaces/Item";
import React, { useCallback } from "react";
import ItemsTable from "../components/ItemsTable";
import { DELETE_ITEM, GET_ITEMS_WITH_SEARCH } from "../queries";
import { useMutation, useQuery } from "@apollo/client";
import NoItems from "../components/NoItems";
import DeleteDialog from "../components/DeleteDialog";
import InventorySnackbar from "../components/InventorySnackbar";
import InventoryHeader from "../components/InventoryHeader";
import { useSearch } from "../hooks/useSearch";
import { useDeleteItem } from "../hooks/useDeleteItem";
import ApolloErrorPage from "./ApolloErrorPage";

export default function Inventory() {
  console.log("Renderizando Inventory.tsx...");
  const { searchValue, search } = useSearch();
  const {
    modalOpen,
    snackOpen,
    handleModalClose,
    handleModalOpen,
    handleDeleteItem,
    handleSnackClose,
    error,
  } = useDeleteItem(searchValue);

  const {
    loading: queryLoading,
    data: queryData,
    error: queryError,
  } = useQuery(GET_ITEMS_WITH_SEARCH, {
    variables: { search: searchValue },
  });
  if (queryError && queryError.networkError) {
    return <ApolloErrorPage error={queryError}></ApolloErrorPage>;
  }

  const items: Item[] = queryLoading || !queryData ? [] : queryData.items;

  return (
    <>
      <Container maxWidth="md">
        <InventoryHeader
          itemsLength={items.length}
          queryLoading={queryLoading}
          search={search}
        />
        {!queryLoading && items.length == 0 ? (
          <NoItems error={queryError} empty={!searchValue}></NoItems>
        ) : (
          <ItemsTable
            items={items}
            handleDeleteItem={handleModalOpen}
            loading={queryLoading}
          ></ItemsTable>
        )}
      </Container>
      <InventorySnackbar
        open={snackOpen}
        error={error}
        onClose={handleSnackClose}
      />
      <DeleteDialog
        open={modalOpen !== 0}
        onClose={handleModalClose}
        onDelete={handleDeleteItem}
      />
    </>
  );
}
