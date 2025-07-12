// src/Header.jsx
import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
  const { user, logout } = useContext(UserContext);

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          MFlix
        </Typography>

        <Stack direction="row" spacing={2}>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/movies">
                Movies
              </Button>

              <Button color="inherit" component={Link} to="/change-password">
                Change Password
              </Button>

              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                Welcome, {user.name}
              </Typography>

              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
