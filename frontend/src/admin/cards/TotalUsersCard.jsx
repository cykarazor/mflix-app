import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from 'react-router-dom';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalUsersCard = ({ token }) => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/users/count`;

  const { count, loading, error } = useAdminCount(apiPath, token);

  useEffect(() => {
    console.log('👥 Users Count:', count);
    if (error) console.error('❌ Users Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Users"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<PeopleIcon color="primary" />}
      />
    </div>
  );
};

export default TotalUsersCard;
