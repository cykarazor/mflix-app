// src/App.jsx
import { useContext } from 'react';
import {
  Container,
  Box,
} from '@mui/material';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LandingPage from './LandingPage';
import MovieList from './MovieList';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Footer from './Footer';
import Header from './Header'; // <-- Use the new Header component
import { UserContext } from './UserContext';
import UserProfile from './UserProfile';
import ChangePassword from './ChangePassword'; // <-- ADD THIS LINE
import { SnackbarProvider } from './contexts/SnackbarContext';

function App() {
  const { user } = useContext(UserContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <SnackbarProvider>
      {/* Wrap the entire app in the SnackbarProvider */}
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />  {/* Use the new Header component */}

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

            {/* NEW: User Profile route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

          </Routes>
        </Container>

        <Footer />
      </Box>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
