import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
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
    onSearchChange(''); // Also clear search in parent
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

      <Button variant="contained" color="primary" type="submit">
        Search
      </Button>
    </Box>
  );
};

export default MovieFilters;
