import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "@mui/material";

export default function SearchField({ searchFn }: { searchFn: Function }) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const lastChange = useRef<NodeJS.Timeout>();
  console.log("Renderizando campo de busqueda...");

  console.log("Search term: " + searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      searchFn(searchTerm);
    }, 500);

    // Cleanup timeout if searchTerm changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Handle key down event to check for Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      searchFn(searchTerm);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    /* if (lastChange.current) {
      clearTimeout(lastChange.current);
    } */
    setSearchTerm(event.target.value);

    /* lastChange.current = setTimeout(() => {
      lastChange.current = undefined;

      searchFn(searchTerm);
    }, 500); */
  };
  return (
    <TextField
      id="search-input"
      label="Search"
      size="small"
      value={searchTerm}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            sx={{ color: "action.active", ml: -1, my: "auto" }}
          >
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ marginY: "auto", pl: 0 }}
    />
  );
}
