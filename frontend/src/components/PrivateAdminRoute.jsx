// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();

  if (user === null) {
    console.log('[PrivateAdminRoute] ⏳ Loading...');
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (user.role !== 'admin') {
    console.log('[PrivateAdminRoute] 🚫 Not an admin, redirecting');
    return <Navigate to="/" replace />;
  }

  console.log('[PrivateAdminRoute] ✅ Admin access granted');
  return children;
};

export default PrivateAdminRoute;
