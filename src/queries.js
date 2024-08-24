import { gql } from "@apollo/client";

export const GET_ITEMS_WITH_SEARCH = gql`
  query getItemsWithSearch($search: String) {
    items(search: $search) {
      itemId
      itemName
      description
    }
  }
`;
export const GET_FILTERED_ITEMS = gql`
  query getFilteredItems($id: Int, $name: String, $state: String) {
    filteredItems(id: $id, name: $name, state: $state) {
      itemId
      itemName
      description
      location {
        state
      }
    }
  }
`
export const GET_STATES = gql`
  query getStates {
    states
  }
`

export const DELETE_ITEM = gql`
  mutation deleteItem($id: Int!) {
    deleteItem(id: $id) {
      itemId
      itemName
    }
  }
`;
export const GET_ITEM = gql`
  query getItem($id: Int) {
    item(id: $id) {
      itemId
      itemName
      description
      location {
        locationId
        address
        state
        phoneNumber
      }
    }
  }
`;

export const ADD_ITEM = gql`
  mutation addItem($newItem: ItemInput!) {
    addItem(newItem: $newItem) {
      itemId
      itemName
      description
    }
  }
`;
export const UPDATE_ITEM = gql`
  mutation updateItem($id: Int!, $newItem: ItemInput!) {
    updateItem(id: $id, newItem: $newItem) {
      itemId
      itemName
      description
    }
  }
`;
