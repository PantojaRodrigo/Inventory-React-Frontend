import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { useQuery } from "@apollo/client";
import {GET_FILTERED_ITEMS} from "../queries";

export function useSearch() {
  const navigate = useNavigate();
  const searchStr = useLocation().search;
  const searchValue = new URLSearchParams(searchStr).get("search") ?? "";

  const search = useCallback(
    (str: string) => {
      navigate("/items?search=" + str);
      console.log("Searching...");
    },
    [navigate]
  );

  return { searchValue, search };
}

// export function useFilters() {
//     const {data, loading, error} = useQuery(GET_FILTERED_ITEMS, {
//         variables: {search: searchValue}
//     });
//
// }