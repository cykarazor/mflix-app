// src/Header.jsx
import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header() {
  const { user, logout } = useContext(UserContext);

  return (
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

        <Stack direction="row" spacing={2}>
          {user ? (
            <>
              {/* Movies link visible to all logged-in users */}
              <Button color="inherit" component={Link} to="/movies">
                Movies
              </Button>

              {/* Admin Dashboard link visible only if user is admin */}
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin Dashboard
                </Button>
              )}

              {/* Profile link visible to all logged-in users */}
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>

              {/* Greeting */}
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                Welcome, {user.name}
              </Typography>

              {/* Logout button */}
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Links for guests */}
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
