// src/admin/AdminFooter.jsx
import { Box, Typography } from '@mui/material';

const AdminFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Mflix
      </Typography>
    </Box>
  );
};

export default AdminFooter;
