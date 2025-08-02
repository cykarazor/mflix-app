// src/admin/AdminHeader.jsx
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const AdminHeader = () => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {/* TODO: Add user menu or logout button here */}
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
