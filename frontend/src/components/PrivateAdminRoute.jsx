// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateAdminRoute = ({ children }) => {
  const { user, loading } = useUser();

  // While user info is loading from localStorage, show spinner
  if (loading) {
    console.log('[PrivateAdminRoute] ⏳ Loading...');
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // If no user or user is not admin, redirect to login page
  if (!user || user.role !== 'admin') {
    console.log('[PrivateAdminRoute] 🚫 Not an admin, redirecting');
    return <Navigate to="/login" replace />;
  }

  // User is admin, grant access to child components
  console.log('[PrivateAdminRoute] ✅ Admin access granted');
  return children;
};

export default PrivateAdminRoute;
