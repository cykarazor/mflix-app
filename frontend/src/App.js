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
import AdminMoviesPage from './admin/pages/AdminMoviesPage';

import Layout from './components/Layout'; // ✅ NEW: shared layout
import AdminLayout from './admin/AdminLayout';
import PrivateAdminRoute from './components/PrivateAdminRoute';
import { UserContext } from './UserContext';
import { SnackbarProvider } from './contexts/SnackbarContext';


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

          {/* ✅ Admin-only routes with AdminLayout */}
            <Route
              path="/admin"
              element={
                <PrivateAdminRoute>
                  <AdminLayout />
                </PrivateAdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="movies" element={<AdminMoviesPage />} />
              {/* Add more nested admin routes here as needed */}
            </Route>
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
