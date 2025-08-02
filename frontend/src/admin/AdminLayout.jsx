// src/admin/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import { Box } from '@mui/material';

const AdminLayout = () => (
  <Box display="flex" height="100vh">
    <Sidebar />
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <AdminHeader />
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Outlet />
      </Box>
      <AdminFooter />
    </Box>
  </Box>
);

export default AdminLayout;
