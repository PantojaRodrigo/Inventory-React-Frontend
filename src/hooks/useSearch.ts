import { useLocation, useNavigate } from "react-router-dom";
import { useCallback } from "react";

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
