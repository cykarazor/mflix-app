import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AdminHeader from './components/AdminHeader';
import AdminFooter from './components/AdminFooter';
import { Box, Toolbar } from '@mui/material'; // ✅ Make sure Toolbar is imported

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AdminHeader onDrawerToggle={handleDrawerToggle} />

      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar /> {/* ✅ This spacer accounts for fixed AppBar height */}
          <Outlet />
        </Box>
      </Box>

      <AdminFooter />
    </Box>
  );
};

export default AdminLayout;
