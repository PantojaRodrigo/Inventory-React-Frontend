import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_ITEM, GET_ITEMS_WITH_SEARCH } from "../queries";
import Item from "../interfaces/Item";

export function useDeleteItem(searchValue: string) {
  const [modalOpen, setModalOpen] = useState<number>(0);
  const [snackOpen, setSnackOpen] = useState(false);

  const [deleteItem, { error }] = useMutation(DELETE_ITEM, {
    refetchQueries: [
      { query: GET_ITEMS_WITH_SEARCH, variables: { search: searchValue } },
    ],
    onCompleted: () => setSnackOpen(true),
    onError: (error) => {
      console.log(error.message);
    },
    update: (cache, { data: { deleteItem } }) => {
      const existingItems = cache.readQuery<{ items: Item[] }>({
        query: GET_ITEMS_WITH_SEARCH,
        variables: { search: searchValue },
      });
      if (!existingItems) return;

      const newItems = existingItems.items.filter(
        (item) => item.itemId !== modalOpen
      );
      cache.writeQuery({
        query: GET_ITEMS_WITH_SEARCH,
        data: { items: newItems },
        variables: { search: searchValue },
      });
    },
    optimisticResponse: {
      deleteItem: { __typename: "Item", itemId: null, itemName: null },
    },
  });

  const handleModalClose = () => setModalOpen(0);
  const handleModalOpen = (itemId: number) => setModalOpen(itemId);
  const handleDeleteItem = () => {
    deleteItem({ variables: { id: modalOpen } });
    setModalOpen(0);
  };
  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

  return {
    modalOpen,
    snackOpen,
    handleModalClose,
    handleModalOpen,
    handleDeleteItem,
    handleSnackClose,
    error,
  };
}
