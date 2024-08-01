import { useCallback, useState, useRef } from "react";
import Item, { Location } from "../interfaces/Item";
import { GET_ITEM, GET_ITEMS_WITH_SEARCH } from "../queries";
import {
  ApolloCache,
  DefaultContext,
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";

interface ErrorMap {
  [key: string]: string;
}
export interface Root {
  data: Data;
}

export interface Data {
  updateItem: UpdateItem;
}

export interface UpdateItem {
  itemId: number;
  itemName: string;
  description: string;
  __typename: string;
}

export function useFormHandlers(
  item: Item | null,
  method: string,
  addItem: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined
  ) => Promise<FetchResult<any>>,
  updateItem: (
    options?:
      | MutationFunctionOptions<
          any,
          OperationVariables,
          DefaultContext,
          ApolloCache<any>
        >
      | undefined
  ) => Promise<FetchResult<any>>
) {
  const [errors, setErrors] = useState<ErrorMap | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const handleSnackClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSnackOpen(false);
    },
    []
  );

  const handleModalOpen = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => {
    form.current?.reset();
    setModalOpen(false);
  }, []);

  const validateId = (id: string, field: string): string | null => {
    if (id === "") return `${field} is required`;
    if (+id < 1) return `${field} must be positive`;
    if (Math.floor(+id) !== +id) return `${field} must be integer`;
    return null;
  };

  const validateForm = (formData: FormData): ErrorMap => {
    const errors: ErrorMap = {};
    const errorId = validateId(formData.get("id") as string, "ID");
    if (errorId) errors.id = errorId;
    if (formData.get("itemName")?.toString().trim() === "")
      errors.itemName = "Item Name is required";
    const errorLocId = validateId(
      formData.get("locationId") as string,
      "Location ID"
    );
    if (errorLocId) errors.locationId = errorLocId;
    if (formData.get("state")?.toString().trim() === "")
      errors.state = "State is required";
    return errors;
  };

  const handleSubmitForm = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrors(null);
      const formData = new FormData(e.currentTarget);
      const formErrors = validateForm(formData);

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
      } else {
        const itemLocation: Location = {
          locationId: parseInt(formData.get("locationId") as string),
          state: formData.get("state")?.toString().trim() as string,
          address: formData.get("address")?.toString().trim() as string,
          phoneNumber: formData.get("number") as unknown as number,
        };
        const newItem: Item = {
          itemId: parseInt(formData.get("id") as string),
          itemName: formData.get("itemName")?.toString().trim() as string,
          description: formData.get("description")?.toString().trim() as string,
          location: itemLocation,
        };

        if (method === "POST") {
          addItem({
            variables: { newItem },
            onError: (error) => {
              console.log(error.message);
            },
          });
        } else if (method === "PATCH") {
          updateItem({
            variables: { id: newItem.itemId, newItem },
            update: (cache: ApolloCache<any>, { data: { updateItem } }) => {
              const existingItems = cache.readQuery({
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
              });
              cache.writeQuery({
                query: GET_ITEM,
                data: { item: newItem },
                variables: { id: item!.itemId },
              });
            },
            onError: (error) => console.error(error.message),
            optimisticResponse: {
              updateItem: {
                __typename: "Item",
                itemId: newItem.itemId,
                itemName: newItem.itemName,
                description: newItem.description,
              },
            },
          });
        }
      }
    },
    [addItem, updateItem, method]
  );

  return {
    errors,
    modalOpen,
    snackOpen,
    form,
    handleSnackClose,
    handleModalClose,
    handleModalOpen,
    handleSubmitForm,
    setSnackOpen,
  };
}
