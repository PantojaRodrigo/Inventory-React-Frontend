import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useRef, useState } from "react";
import debounce from "@mui/material";

const SearchField = React.memo(({ searchFn }: { searchFn: Function }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const lastChange = useRef<string>("");
  useEffect(() => {
    if (
      lastChange.current !== "Enter" &&
      (searchTerm !== "" || lastChange.current === "Backspace")
    ) {
      const handler = setTimeout(() => {
        searchFn(searchTerm);
      }, 500);
      console.log(lastChange.current);

      // Cleanup timeout if searchTerm changes or component unmounts
      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchTerm]);

  // Handle key down event to check for Enter key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      searchFn(searchTerm);
    }
    lastChange.current = event.key;
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
    searchFn("");
  };

  return (
    <TextField
      id="search-input"
      label="Search items"
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
        endAdornment: (
          <InputAdornment position="end">
            {searchTerm && (
              <IconButton
                onClick={handleClear}
                size="small"
                sx={{ color: "action.active", mr: -1.5 }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
      sx={{ marginY: "auto", pl: 0 }}
    />
  );
});
export default SearchField;
