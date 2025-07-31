import { Box, Typography } from '@mui/material';

const AdminUsersPage = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Manage Users
      </Typography>
      <Typography variant="body1">
        This page will show a list of normal users with options to view, edit, or delete.
      </Typography>
    </Box>
  );
};

export default AdminUsersPage;
