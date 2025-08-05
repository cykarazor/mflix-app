import { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const MovieFilters = ({ search, onSearchChange, yearFilter, onYearChange }) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Sync with parent `search` prop if it changes externally
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounced update to parent
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange(localSearch);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [localSearch, search, onSearchChange]);

  const yearOptions = ['2025', '2024', '2023', '2022', '2021', '2020', ''];

  return (
    <Box display="flex" flexWrap="wrap" gap={2} my={2}>
      <TextField
        label="Search by title / plot / cast / director"
        variant="outlined"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        size="small"
      />
      <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Filter by Year</InputLabel>
        <Select
          value={yearFilter}
          onChange={(e) => onYearChange(e.target.value)}
          label="Filter by Year"
        >
          <MenuItem value="">All Years</MenuItem>
          {yearOptions.map((year) => (
            <MenuItem key={year} value={year}>
              {year || 'All'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MovieFilters;
