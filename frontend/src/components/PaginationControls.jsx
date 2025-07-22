// frontend/src/components/PaginationControls.jsx
import { Stack, Typography, IconButton, Tooltip, TextField, MenuItem } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PaginationControls({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  // Prepare page options for dropdown
  const pageOptions = [];
  for (let i = 1; i <= totalPages; i++) {
    pageOptions.push(i);
  }

  const handlePageSelect = (event) => {
    setPage(Number(event.target.value));
  };

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{ mt: 4, flexWrap: 'wrap' }}
    >
      {/* First Page Button */}
      <Tooltip title="First Page" arrow>
        <span>
          <IconButton
            onClick={() => setPage(1)}
            disabled={page === 1}
            color="primary"
            size="large"
            aria-label="Go to first page"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 4,
              },
            }}
          >
            <FirstPageIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Previous Page Button */}
      <Tooltip title="Previous Page" arrow>
        <span>
          <IconButton
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            color="primary"
            size="large"
            aria-label="Go to previous page"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 4,
              },
            }}
          >
            <NavigateBeforeIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Page Dropdown Selector */}
      <TextField
        select
        size="small"
        value={page}
        onChange={handlePageSelect}
        sx={{ minWidth: 80, maxWidth: 100 }}
        aria-label="Select page"
      >
        {pageOptions.map((p) => (
          <MenuItem key={p} value={p}>
            {p}
          </MenuItem>
        ))}
      </TextField>

      {/* Page info text */}
      <Typography
        variant="body2"
        sx={{ minWidth: 120, textAlign: 'center', color: 'text.secondary', userSelect: 'none' }}
      >
        Page {page} of {totalPages}
      </Typography>

      {/* Next Page Button */}
      <Tooltip title="Next Page" arrow>
        <span>
          <IconButton
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            color="primary"
            size="large"
            aria-label="Go to next page"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 4,
              },
            }}
          >
            <NavigateNextIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Last Page Button */}
      <Tooltip title="Last Page" arrow>
        <span>
          <IconButton
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            color="primary"
            size="large"
            aria-label="Go to last page"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 4,
              },
            }}
          >
            <LastPageIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
