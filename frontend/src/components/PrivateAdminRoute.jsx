// frontend/src/components/PrivateAdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const PrivateAdminRoute = ({ children }) => {
  const { user } = useUser();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateAdminRoute;
