// src/Header.jsx
import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Box,
  Divider,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Movie as MovieIcon,
  AdminPanelSettings as AdminIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
  const { user, logout } = useContext(UserContext);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Movies', path: '/movies', icon: <MovieIcon /> },
  ];

  if (user?.isAdmin) {
    navItems.push({ label: 'Admin Dashboard', path: '/admin', icon: <AdminIcon /> });
  }

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const drawer = (
    <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
      <Box sx={{ width: 240 }} role="presentation" onClick={handleDrawerToggle}>
        <Box sx={{ p: 2 }}>
          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar>{user.username?.charAt(0).toUpperCase()}</Avatar>
              <Typography variant="subtitle1">{user.username}</Typography>
            </Stack>
          ) : (
            <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
              Guest
            </Typography>
          )}
        </Box>

        <Divider />

        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>

        <Divider />

        <List>
          {user ? (
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          ) : (
            <ListItem button component={Link} to="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <Slide direction="down" in mountOnEnter unmountOnExit>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              MFlix
            </Typography>

            {isMobile ? (
              <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                <MenuIcon />
              </IconButton>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color={isActive(item.path) ? 'secondary' : 'inherit'}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                    startIcon={item.icon}
                    sx={{ textTransform: 'none' }}
                  >
                    {item.label}
                  </Button>
                ))}

                {user ? (
                  <>
                    <Avatar sx={{ width: 30, height: 30 }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ ml: 1 }}>{user.username}</Typography>
                    <Button onClick={logout} color="inherit" startIcon={<LogoutIcon />}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    color="inherit"
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                )}
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      </Slide>

      {drawer}
    </>
  );
}
