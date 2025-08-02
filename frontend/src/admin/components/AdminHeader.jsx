// src/admin/components/AdminHeader.jsx
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { UserContext } from '../../UserContext';

const drawerWidth = 240;

const AdminHeader = ({ onDrawerToggle }) => {
  const { user, logout } = React.useContext(UserContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  return (
    <>
    <AppBar
      position="fixed"
      color="primary"
      enableColorOnDark
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side: title + hamburger */}
        <Box display="flex" alignItems="center">
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

          <Typography variant="h6" noWrap component="div">
            M-Flix Administrator
          </Typography>
        </Box>

        {/* Right side: Welcome + Logout */}
        <Box display="flex" alignItems="center" gap={1}>
          <AccountCircleIcon />
          <Tooltip title={user?.name || 'Admin'}>
            <Typography
              variant="body1"
              component="span"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: isMobile ? 140 : 'none', // more room than 100
              }}
            >
              Welcome, {user?.name || 'Admin'}
            </Typography>
          </Tooltip>

          {/* ✅ Logout only on large screens */}
          {!isMobile && (
            <IconButton color="inherit" onClick={() => setConfirmOpen(true)} title="Logout">
              <LogoutIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>

    {/* ✅ Logout Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="logout-confirm-dialog"
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmOpen(false)}>Cancel</MuiButton>
          <MuiButton onClick={() => { setConfirmOpen(false); logout(); }} color="error" variant="contained">
            Logout
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminHeader;
