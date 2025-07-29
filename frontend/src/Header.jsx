// src/Header.jsx
import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useLocation } from 'react-router-dom';


export default function Header() {
  const { user, logout } = useContext(UserContext);
  console.log('Header user:', user);  // <-- debug here

  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  
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
              <Button
                color={isActive('/movies') ? 'secondary' : 'inherit'}
                component={Link}
                to="/movies"
              >
                Movies
              </Button>

              {user.role === 'admin' && (
                <Button
                  color={isActive('/admin') ? 'secondary' : 'inherit'}
                  component={Link}
                  to="/admin"
                >
                  Admin Dashboard
                </Button>
              )}

              <Button
                color={isActive('/profile') ? 'secondary' : 'inherit'}
                component={Link}
                to="/profile"
              >
                Profile
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
              <Button
                color={isActive('/login') ? 'secondary' : 'inherit'}
                component={Link}
                to="/login"
              >
                Login
              </Button>
              <Button
                color={isActive('/register') ? 'secondary' : 'inherit'}
                component={Link}
                to="/register"
              >
                Register
              </Button>
            </>
          )}
        </Stack>

      </Toolbar>
    </AppBar>
  );
}
