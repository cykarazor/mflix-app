// src/App.jsx
import React, { useContext } from 'react';
import {
  Container,
  Button,
  Stack,
  Typography,
  AppBar,
  Toolbar,
  Box,
} from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom';

import LandingPage from './LandingPage';
import MovieList from './MovieList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Footer from './Footer';
import { UserContext } from './UserContext';

// Import ChangePassword component
import ChangePassword from './ChangePassword'; // <-- ADD THIS LINE

function App() {
  const { user, logout } = useContext(UserContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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

                  {/* NEW: Add a Change Password link/button */}
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

        <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/movies" />} />

            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              }
            />

            {/* NEW: Change Password route */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route path="/login" element={user ? <Navigate to="/movies" replace /> : <LoginForm />} />
            <Route
              path="/register"
              element={user ? <Navigate to="/movies" replace /> : <RegisterForm />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;
