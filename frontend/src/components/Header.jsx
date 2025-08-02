// src/Header.jsx
import { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button as MuiButton,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../UserContext';

import MovieIcon from '@mui/icons-material/Movie';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from '@mui/icons-material/Logout';
import { red } from '@mui/material/colors';

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (path) => ({
    color: isActive(path) ? '#fff' : 'inherit',
    backgroundColor: isActive(path) ? '#1565c0' : 'transparent',
    borderRadius: 1,
    textTransform: 'none',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    '&:hover': {
      backgroundColor: isActive(path) ? '#0d47a1' : 'rgba(255, 255, 255, 0.08)',
    },
  });

  const drawerLinks = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {user ? (
          <>
            <ListItem button component={Link} to="/movies">
              <ListItemIcon><MovieIcon /></ListItemIcon>
              <ListItemText primary="Movies" />
            </ListItem>
            {user.role === 'admin' && (
              <ListItem button component={Link} to="/admin">
                <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
                <ListItemText primary="Admin Dashboard" />
              </ListItem>
            )}
            <ListItem button component={Link} to="/profile">
              <ListItemIcon><AccountCircleIcon /></ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => setConfirmOpen(true)}>
              <ListItemIcon><LogoutIcon sx={{ color: red[500] }} /></ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: red[500] }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login">
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to="/register">
              <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Site Title */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            MFlix
          </Typography>

          {/* Hamburger Icon for small screens */}
          <IconButton
            edge="end"
            color="inherit"
            sx={{ display: { xs: 'flex', sm: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* Stack for medium+ screens */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            alignItems="center"
          >
            {user ? (
              <>
                <Button
                  component={Link}
                  to="/movies"
                  sx={navButtonStyle('/movies')}
                  startIcon={<MovieIcon />}
                >
                  Movies
                </Button>

                {user.role === 'admin' && (
                  <Button
                    component={Link}
                    to="/admin"
                    sx={navButtonStyle('/admin')}
                    startIcon={<AdminPanelSettingsIcon />}
                  >
                    Admin Dashboard
                  </Button>
                )}

                <Button
                  component={Link}
                  to="/profile"
                  sx={navButtonStyle('/profile')}
                  startIcon={<AccountCircleIcon />}
                >
                  Profile
                </Button>

                <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                  Welcome, {user.name}
                </Typography>

                <Button
                  onClick={() => setConfirmOpen(true)}
                  sx={{
                    color: red[500],
                    backgroundColor: 'transparent',
                    borderRadius: 1,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: red[50],
                    },
                  }}
                  startIcon={<LogoutIcon />}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  sx={navButtonStyle('/login')}
                  startIcon={<LoginIcon />}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  sx={navButtonStyle('/register')}
                  startIcon={<AppRegistrationIcon />}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile nav */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {drawerLinks}
      </Drawer>

      {/* Logout Confirmation Dialog */}
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
}
