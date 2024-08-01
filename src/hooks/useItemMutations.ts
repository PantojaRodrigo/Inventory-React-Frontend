import { useMutation } from "@apollo/client";
import {
  ADD_ITEM,
  GET_ITEM,
  GET_ITEMS_WITH_SEARCH,
  UPDATE_ITEM,
} from "../queries";
import Item from "../interfaces/Item";
import { json } from "react-router-dom";

export function useAddItem(onCompleted: () => void) {
  const [addItem, { error, loading }] = useMutation(ADD_ITEM, {
    refetchQueries: [
      { query: GET_ITEMS_WITH_SEARCH, variables: { search: "" } },
    ],
    onCompleted,
    onError: (error) => {
      console.log(error.message);
    },
    update: (cache, { data: { addItem } }) => {
      const existingItems = cache.readQuery({
        query: GET_ITEMS_WITH_SEARCH,
        variables: { search: "" },
      }) as { items: Item[] };

      if (existingItems) {
        const newItems = [...existingItems.items, addItem];
        cache.writeQuery({
          query: GET_ITEMS_WITH_SEARCH,
          data: { items: newItems },
          variables: { search: "" },
        });
      }
    },
  });

  return { addItem, addError: error, addLoading: loading };
}

export function useUpdateItem(item: Item | null, onCompleted: () => void) {
  const [updateItem, { error, loading }] = useMutation(UPDATE_ITEM, {
    refetchQueries: [
      { query: GET_ITEM, variables: { id: item?.itemId } },
      { query: GET_ITEMS_WITH_SEARCH, variables: { search: "" } },
    ],
    onCompleted,

    update: (cache, { data: { updateItem } }) => {
      console.log("UPDATE!!!!!!!!");
      /* const existingItems = cache.readQuery({
        query: GET_ITEMS_WITH_SEARCH,
        variables: { search: "" },
      }) as { items: Item[] };
      console.log(updateItem);

      const newItems = existingItems.items.map((item) =>
        item.itemId === updateItem.itemId ? updateItem : item
      );

      cache.writeQuery({
        query: GET_ITEMS_WITH_SEARCH,
        data: { items: newItems },
        variables: { search: "" },
      }); */
    },
  });

  return { updateItem, updateError: error, updateLoading: loading };
}
