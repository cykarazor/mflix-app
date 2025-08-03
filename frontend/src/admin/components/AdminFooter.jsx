// src/admin/AdminFooter.jsx
import { Box, Typography, Link, Stack } from '@mui/material';

const AdminFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        borderTop: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[300]
            : theme.palette.grey[700],
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        textAlign={{ xs: 'center', sm: 'left' }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Mflix Admin Panel. All rights reserved.
        </Typography>

        <Stack direction="row" spacing={2}>
          <Link
            href="#"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Help
          </Link>
          <Link
            href="#"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Privacy
          </Link>
          <Link
            href="#"
            underline="hover"
            color="primary"
            sx={{ fontSize: 14 }}
          >
            Terms
          </Link>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AdminFooter;
