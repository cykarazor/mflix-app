// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../UserContext';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();
  console.log('PrivateAdminRoute user:', user);

  if (!user || user.role !== 'admin') {
    console.log('Redirecting non-admin user or unauthenticated user');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
