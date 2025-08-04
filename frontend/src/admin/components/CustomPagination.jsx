import { Pagination, Box } from '@mui/material';

export default function CustomPagination({ page, rowCount, pageSize, onPageChange }) {
  const pageCount = Math.ceil(rowCount / pageSize);

  if (pageCount === 0) return null;

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      my={2}
      sx={{ userSelect: 'none' }}
    >
      <Pagination
        count={pageCount}
        page={page + 1} // DataGrid page is zero-based, MUI Pagination is 1-based
        onChange={(_, value) => onPageChange(value - 1)}
        showFirstButton
        showLastButton
        siblingCount={1}
        boundaryCount={1}
        color="primary"
        shape="rounded"
        size="medium"
      />
    </Box>
  );
}
