import {IconButton, InputAdornment, MenuItem, TextField} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import React, { useCallback, useEffect, useRef, useState } from "react";
import debounce from "@mui/material";

interface FilterFieldProps {
    value: string | number;
    onChange: (event: React.ChangeEvent<HTMLInputElement>)=>void;
    options?: Array<string>;
    name: string;
    label: string;
}
const FilterField = ({ value, onChange, options, name, label }: FilterFieldProps) => {

    return (
        <TextField
            id="search-input"
            name={name}
            label={label}
            size="small"
            value={value}
            type='search'
            select={!!options}
            onChange={onChange}
            fullWidth
            sx={{ marginY: "auto", pl: 0 }}
        >
            {options && <MenuItem value="">&nbsp;</MenuItem>}
            {options?.map((option) => (
                <MenuItem key={option} value={option}>
                    {option}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default FilterField;
