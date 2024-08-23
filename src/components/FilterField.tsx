import {MenuItem, TextField} from "@mui/material";
import React from "react";

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
            name={name}
            label={label}
            size="small"
            value={value}
            type='search'
            select={!!options}
            onChange={onChange}
            fullWidth
            sx={{ marginY: "auto", pl: 0 }}
            inputProps={{"aria-label": name}}
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
