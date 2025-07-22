// frontend/src/components/PaginationControls.jsx
import { Stack, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PaginationControls({ page, setPage, totalPages }) {
  if (totalPages <= 1) return null;

  return (
    <Stack alignItems="center" sx={{ mt: 4 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => setPage(value)}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{
              first: FirstPageIcon,
              last: LastPageIcon,
              previous: NavigateBeforeIcon,
              next: NavigateNextIcon,
            }}
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                boxShadow: 3,
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: 4,
              },
              minWidth: { xs: 32, sm: 36 },
              minHeight: { xs: 32, sm: 36 },
              mx: 0.5,
            }}
          />
        )}
        sx={{
          '& .MuiPagination-ul': {
            justifyContent: 'center',
            gap: 8,
          },
        }}
      />
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Page {page} of {totalPages}
      </Typography>
    </Stack>
  );
}
