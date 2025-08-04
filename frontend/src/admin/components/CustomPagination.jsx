// src/admin/components/CustomPagination.jsx

import {
  Box,
  Select,
  MenuItem,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
} from '@mui/material';

export default function CustomPagination({ page, rowCount, pageSize, onPageChange }) {
  const pageCount = Math.ceil(rowCount / pageSize);
  if (pageCount === 0) return null;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      gap={2}
      my={2}
      sx={{ userSelect: 'none' }}
    >
      {/* MUI Pagination */}
      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(_, value) => onPageChange(value - 1)}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        color="primary"
        shape="rounded"
        size="medium"
      />

      {/* Page indicator */}
      <Typography variant="body2" sx={{ minWidth: 100 }}>
        Page {page + 1} of {pageCount}
      </Typography>

      {/* Page Jump Dropdown */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="page-select-label">Go to Page</InputLabel>
        <Select
          labelId="page-select-label"
          value={page}
          label="Go to Page"
          onChange={(e) => onPageChange(e.target.value)}
        >
          {Array.from({ length: pageCount }).map((_, i) => (
            <MenuItem key={i} value={i}>
              Page {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
