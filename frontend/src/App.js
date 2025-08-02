// src/App.jsx
import { useContext } from 'react';
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
import UserProfile from './UserProfile';
import ChangePassword from './ChangePassword';
import AdminDashboard from './admin/AdminDashboard';
import AdminUsersPage from './admin/pages/AdminUsersPage';

import Layout from './components/Layout'; // ✅ NEW: shared layout
import PrivateAdminRoute from './components/PrivateAdminRoute';
import { UserContext } from './UserContext';
import { SnackbarProvider } from './contexts/SnackbarContext';

// ❌ REMOVED: These are now inside Layout
// import Header from './Header';
// import Footer from './Footer';
// import Container from '@mui/material/Container';
// import Box from '@mui/material/Box';

function App() {
  const { user } = useContext(UserContext);

  const ProtectedRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          {/* ✅ Public + user-auth routes go inside the shared layout */}
          <Route element={<Layout />}>
            <Route
              path="/"
              element={!user ? <LandingPage /> : <Navigate to="/movies" />}
            />

            <Route
              path="/movies"
              element={
                <ProtectedRoute>
                  <MovieList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/login"
              element={user ? <Navigate to="/movies" replace /> : <LoginForm />}
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/movies" replace /> : <RegisterForm />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

          {/* ✅ Admin-only routes (can use separate layout later) */}
          <Route
            path="/admin"
            element={
              <PrivateAdminRoute>
                <AdminDashboard />
              </PrivateAdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateAdminRoute>
                <AdminUsersPage />
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
