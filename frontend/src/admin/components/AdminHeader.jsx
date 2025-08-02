// src/admin/components/AdminHeader.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import { UserContext } from '../../UserContext';

const AdminHeader = ({ onDrawerToggle }) => {
  const { user, logout } = React.useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        {/* Hamburger menu on mobile */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>

        {/* Welcome message and logout */}
        <Box display="flex" alignItems="center" gap={1}>
          <AccountCircleIcon />
          <Typography variant="body1" component="span" sx={{ whiteSpace: 'nowrap' }}>
            Welcome, {user?.name || 'Admin'}
          </Typography>

          <IconButton color="inherit" onClick={logout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;
