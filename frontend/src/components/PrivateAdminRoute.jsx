// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();

  console.log('[PrivateAdminRoute] Current user:', user);

  if (!user || user.role !== 'admin') {
    console.log('[Redirecting to /] Unauthorized or not admin');
    return <Navigate to="/" replace />;
  }

  return children;
};


export default PrivateAdminRoute;
