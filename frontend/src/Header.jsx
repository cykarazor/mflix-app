// src/Header.jsx
import { useContext } from 'react';
import { AppBar, Toolbar, Typography, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { useLocation } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from '@mui/icons-material/Logout';
import { red } from '@mui/material/colors';

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
              <Button 
              component={Link} to="/movies" 
              sx={navButtonStyle('/movies')} 
              startIcon={<MovieIcon />}
              >
                Movies
              </Button>

              {user.role === 'admin' && (
                <Button 
                component={Link} to="/admin" 
                sx={navButtonStyle('/admin')}
                startIcon={<AdminPanelSettingsIcon />}
                >
                  Admin Dashboard
                </Button>
              )}

              <Button 
              component={Link} to="/profile" 
              sx={navButtonStyle('/profile')}
              startIcon={<AccountCircleIcon />}
              >
                Profile
              </Button>

              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                Welcome, {user.name}
              </Typography>

              <Button
                onClick={logout}
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
              component={Link} to="/login" 
              sx={navButtonStyle('/login')}
              startIcon={<LoginIcon />}
              >
                Login
              </Button>
              <Button 
              component={Link} to="/register" 
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
  );
}
