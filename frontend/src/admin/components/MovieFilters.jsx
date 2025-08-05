import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const MovieFilters = ({ search, onSearchChange, yearFilter, onYearChange }) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearchChange(localSearch.trim());
  };

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const yearOptions = ['2025', '2024', '2023', '2022', '2021', '2020', ''];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexWrap="wrap"
      gap={2}
      my={2}
      alignItems="center"
    >
      <TextField
        label="Search by title / plot / cast / director"
        variant="outlined"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        size="small"
        sx={{ flexGrow: 1, minWidth: 200 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: localSearch && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search icon button */}
      <IconButton
        type="submit"
        color="primary"
        aria-label="submit search"
        sx={{ ml: 0 }}
        size="large"
      >
        <SearchIcon />
      </IconButton>

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
