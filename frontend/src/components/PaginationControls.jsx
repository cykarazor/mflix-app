// frontend/src/components/PaginationControls.jsx
import { Stack, Button, Typography, Box } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PaginationControls({ page, setPage, totalPages }) {
  const goToFirst = () => setPage(1);
  const goToPrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const goToLast = () => setPage(totalPages);

  if (totalPages <= 1) return null;

  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4, flexWrap: 'wrap' }}>
      <Button
        variant="outlined"
        onClick={goToFirst}
        disabled={page === 1}
        startIcon={<FirstPageIcon />}
      >
        <Box display={{ xs: 'none', sm: 'inline' }}>First</Box>
      </Button>

      <Button
        variant="outlined"
        onClick={goToPrev}
        disabled={page === 1}
        startIcon={<NavigateBeforeIcon />}
      >
        <Box display={{ xs: 'none', sm: 'inline' }}>Prev</Box>
      </Button>

      <Typography variant="body2" sx={{ alignSelf: 'center', px: 1 }}>
        Page {page} of {totalPages}
      </Typography>

      <Button
        variant="outlined"
        onClick={goToNext}
        disabled={page === totalPages}
        endIcon={<NavigateNextIcon />}
      >
        <Box display={{ xs: 'none', sm: 'inline' }}>Next</Box>
      </Button>

      <Button
        variant="outlined"
        onClick={goToLast}
        disabled={page === totalPages}
        endIcon={<LastPageIcon />}
      >
        <Box display={{ xs: 'none', sm: 'inline' }}>Last</Box>
      </Button>
    </Stack>
  );
}
// This component provides pagination controls for navigating through pages of content.