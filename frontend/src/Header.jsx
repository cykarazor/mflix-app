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
              <Button component={Link} to="/movies" sx={navButtonStyle('/movies')}>
                Movies
              </Button>

              {user.role === 'admin' && (
                <Button component={Link} to="/admin" sx={navButtonStyle('/admin')}>
                  Admin Dashboard
                </Button>
              )}

              <Button component={Link} to="/profile" sx={navButtonStyle('/profile')}>
                Profile
              </Button>

              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                Welcome, {user.name}
              </Typography>

              <Button
                onClick={logout}
                sx={{
                  color: 'inherit',
                  backgroundColor: 'transparent',
                  borderRadius: 1,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" sx={navButtonStyle('/login')}>
                Login
              </Button>
              <Button component={Link} to="/register" sx={navButtonStyle('/register')}>
                Register
              </Button>
            </>
          )}
        </Stack>

      </Toolbar>
    </AppBar>
  );
}
