import React, {ChangeEvent, Dispatch} from "react";
import {
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from "@mui/material";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import SearchField from "../components/SearchField";
import {FilterList} from "@mui/icons-material";
import FilterField from "./FilterField";
import {useQuery} from "@apollo/client";
import {GET_STATES} from "../queries";
import {FiltersProps} from "../pages/Inventory";


interface InventoryHeaderProps {
  itemsLength: number;
  queryLoading: boolean;
  filters: FiltersProps;
  setFilters: React.Dispatch<React.SetStateAction<FiltersProps>>;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({ itemsLength, queryLoading, filters, setFilters }) => {
  const [filterVisible, setFilterVisible] = React.useState<Boolean>(false);

  const handleOnFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'id') {
      event.target.value = event.target.value.replace(/\D/g, '');
    }
    setFilters((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
    console.log(filters)
  }
  const handleToggleFilterIcon = () => {
    // e.preventDefault();
    setFilterVisible(!filterVisible);
    setFilters({id:"", name: "", state: ""});
  }

  const {data, loading, error} = useQuery(GET_STATES);

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      maxWidth="md"
      spacing={1}
      marginY={1}
    >
      <Grid item xs={10} sm={10} md={10} minWidth="100px" sx={{ my: "auto" }}>
        {!queryLoading && (
          <Typography variant="h6" gutterBottom marginY="auto">
            Showing {itemsLength} items
          </Typography>
        )}
      </Grid>
      <Grid item xs={1} sm={1} md={1} lg={1}>
        <IconButton
          aria-label="filter"
          onClick={handleToggleFilterIcon}
        >
            <FilterList />
        </IconButton>
      </Grid>
      <Grid item xs={1} sm={1} md={1} lg={1}>
        <Link to="newItem">
          <Fab
            color="primary"
            aria-label="add"
            size="medium"
            sx={{ backgroundColor: "rgb(0,196,179)" }}
          >
            <AddIcon />
          </Fab>
        </Link>
      </Grid>
      {filterVisible && (
        <>
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <FilterField
              name={"id"}
              label={"Filter By Id"}
              value={filters.id}
              onChange={handleOnFilterChange}
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <FilterField
              name={"name"}
              label={"Filter By Name"}
              value={filters.name}
              onChange={handleOnFilterChange}
            />
          </Grid>
          <Grid item xs={4} sm={4} md={4} lg={4}>
            <FilterField
              name={"state"}
              label={"Filter By State"}
              value={filters.state}
              onChange={handleOnFilterChange}
              options={data.states}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default InventoryHeader;
