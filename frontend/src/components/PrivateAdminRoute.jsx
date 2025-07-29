// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();

  console.log('[PrivateAdminRoute] user:', user);

  if (!user) {
    console.log('[PrivateAdminRoute] ❌ No user found');
    return <Navigate to="/" replace />;
  }

  if (user.role !== 'admin') {
    console.log('[PrivateAdminRoute] ❌ User is not admin, role:', user.role);
    return <Navigate to="/" replace />;
  }

  console.log('[PrivateAdminRoute] ✅ Admin access granted');
  return children;
};

export default PrivateAdminRoute;

