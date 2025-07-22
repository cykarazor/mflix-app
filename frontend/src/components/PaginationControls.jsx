// frontend/src/components/PaginationControls.jsx
import {
  Stack,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PaginationControls({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageSelect = (event) => {
    setPage(Number(event.target.value));
  };

  return (
    <Stack spacing={1} alignItems="center" sx={{ mt: 4 }}>
      {/* Row 1: Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        {/* First Page */}
        <Tooltip title="First Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage(1)}
              disabled={page === 1}
              color="primary"
              size="large"
              aria-label="Go to first page"
              sx={iconStyle}
            >
              <FirstPageIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Prev */}
        <Tooltip title="Previous Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              color="primary"
              size="large"
              aria-label="Go to previous page"
              sx={iconStyle}
            >
              <NavigateBeforeIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Dropdown */}
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

        {/* Next */}
        <Tooltip title="Next Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              color="primary"
              size="large"
              aria-label="Go to next page"
              sx={iconStyle}
            >
              <NavigateNextIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Last Page */}
        <Tooltip title="Last Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              color="primary"
              size="large"
              aria-label="Go to last page"
              sx={iconStyle}
            >
              <LastPageIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Row 2: Page info */}
      <Typography
        variant="body2"
        sx={{ mt: 1, color: 'text.secondary', userSelect: 'none' }}
      >
        Page {page} of {totalPages}
      </Typography>
    </Stack>
  );
}

// Shared button style
const iconStyle = {
  borderRadius: 2,
  boxShadow: 1,
  '&:hover': {
    backgroundColor: 'primary.light',
    color: 'primary.contrastText',
    boxShadow: 4,
  },
};
