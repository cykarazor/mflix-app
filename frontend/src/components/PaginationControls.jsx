// frontend/src/components/PaginationControls.jsx
import {
  Stack,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
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
    <Stack spacing={2} alignItems="center" sx={{ mt: 5 }}>
      {/* Row 1: Pagination Buttons */}
      <Stack
        direction="row"
        spacing={{ xs: 1, sm: 2 }}
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
              aria-label="Go to first page"
              sx={iconStyle}
            >
              <FirstPageIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Previous Page */}
        <Tooltip title="Previous Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              color="primary"
              aria-label="Go to previous page"
              sx={iconStyle}
            >
              <NavigateBeforeIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>

        {/* Page Select Dropdown */}
        <TextField
          select
          size="small"
          value={page}
          onChange={handlePageSelect}
          sx={{
            minWidth: { xs: 70, sm: 100 },
            maxWidth: { xs: 90, sm: 120 },
            backgroundColor: 'white',
            borderRadius: 1,
          }}
          aria-label="Select page"
        >
          {pageOptions.map((p) => (
            <MenuItem key={p} value={p}>
              Page {p}
            </MenuItem>
          ))}
        </TextField>

        {/* Next Page */}
        <Tooltip title="Next Page" arrow>
          <span>
            <IconButton
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              color="primary"
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
              aria-label="Go to last page"
              sx={iconStyle}
            >
              <LastPageIcon fontSize="inherit" />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* Row 2: Page Info */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, userSelect: 'none' }}
      >
        Page {page} of {totalPages}
      </Typography>
    </Stack>
  );
}

// Shared responsive button style
const iconStyle = {
  borderRadius: 2,
  boxShadow: 1,
  fontSize: { xs: '1rem', sm: '1.5rem' },
  padding: { xs: 0.5, sm: 1 },
  minWidth: { xs: 32, sm: 40 },
  minHeight: { xs: 32, sm: 40 },
  transition: '0.2s ease',
  '&:hover': {
    backgroundColor: 'primary.light',
    color: 'primary.contrastText',
    boxShadow: 4,
  },
};
