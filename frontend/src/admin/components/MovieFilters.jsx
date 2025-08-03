import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const MovieFilters = ({ search, onSearchChange, yearFilter, onYearChange }) => {
  // We'll use static year options for now — you can make it dynamic later
  const yearOptions = ['2025', '2024', '2023', '2022', '2021', '2020', ''];

  return (
    <Box display="flex" flexWrap="wrap" gap={2} my={2}>
      <TextField
        label="Search by title or director"
        variant="outlined"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
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
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default MovieFilters;
