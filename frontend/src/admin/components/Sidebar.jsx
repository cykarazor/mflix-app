// src/admin/components/Sidebar.jsx
import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MovieIcon from '@mui/icons-material/Movie';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { UserContext } from '../../UserContext';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = React.useContext(UserContext);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile) onClose(); // Close drawer on mobile after selecting
  };

  return (
    <>
      {/* Mobile menu icon 
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 8,
            left: 8,
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>
      )} */}

      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <Box p={2}>
          <Typography variant="h6">Admin Menu</Typography>
          <List>

            {/* ✅ Dashboard */}
            <ListItemButton onClick={() => handleMenuClick('/admin')}>
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            {/* ✅ Users */}
            <ListItemButton onClick={() => handleMenuClick('/admin/users?role=user')}>
              <ListItemIcon><GroupIcon /></ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>

            {/* ✅ Admins */}
            <ListItemButton onClick={() => handleMenuClick('/admin/users?role=admin')}>
              <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
              <ListItemText primary="Admins" />
            </ListItemButton>

            {/* ✅ Movies */}
            <ListItemButton onClick={() => handleMenuClick('/admin/movies')}>
              <ListItemIcon><MovieIcon /></ListItemIcon>
              <ListItemText primary="Movies" />
            </ListItemButton>

            {/* ✅ Comments */}
            <ListItemButton onClick={() => handleMenuClick('/admin/comments')}>
              <ListItemIcon><CommentIcon /></ListItemIcon>
              <ListItemText primary="Comments" />
            </ListItemButton>

            {/* ✅ Likes */}
            <ListItemButton onClick={() => handleMenuClick('/admin/likes')}>
              <ListItemIcon><ThumbUpIcon color="success" /></ListItemIcon>
              <ListItemText primary="Likes" />
            </ListItemButton>

            {/* ✅ Dislikes */}
            <ListItemButton onClick={() => handleMenuClick('/admin/dislikes')}>
              <ListItemIcon><ThumbDownIcon color="error" /></ListItemIcon>
              <ListItemText primary="Dislikes" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />

            {/* ✅ Logout - Always visible */}
            <ListItemButton onClick={() => setConfirmOpen(true)}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      {/* ✅ Logout Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="logout-confirm-dialog"
      >
        <DialogTitle id="logout-confirm-dialog">Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </MuiButton>
          <MuiButton
            onClick={() => {
              setConfirmOpen(false);
              logout();
            }}
            color="error"
            variant="contained"
          >
            Logout
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Sidebar;
