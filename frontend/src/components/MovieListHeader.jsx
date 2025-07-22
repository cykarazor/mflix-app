import { Stack, TextField, MenuItem, IconButton, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const sortOptions = [
  { label: 'Title', value: 'title' },
  { label: 'Release Year', value: 'year' },
  { label: 'IMDb Rating', value: 'rating' },
  { label: 'Popularity (Votes)', value: 'popularity' },
  { label: 'Date Added', value: 'dateAdded' },
];

export default function MovieListHeader({ search, setSearch, sort, setSort, ascending, setAscending }) {
  return (
    <Stack spacing={2} sx={{ mb: 4 }}>
      {/* Title */}
      <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
        MFlix Movies
      </Typography>

      {/* Filters */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ maxWidth: 400 }}
          InputProps={{
            endAdornment: search ? (
              <IconButton
                aria-label="clear search"
                onClick={() => setSearch('')}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            ) : null,
          }}
        />

        <TextField
          select
          label="Sort By"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ width: 180 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <IconButton
          onClick={() => setAscending((prev) => !prev)}
          aria-label={ascending ? 'Sort ascending' : 'Sort descending'}
        >
          {ascending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
      </Stack>
    </Stack>
  );
}
