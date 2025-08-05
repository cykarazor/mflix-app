import { useNavigate } from 'react-router-dom';
import ShieldIcon from '@mui/icons-material/Shield';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalAdminsCard = () => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/users/count?role=admin`;

  const { count, loading, error } = useAdminCount(apiPath);

  useEffect(() => {
    console.log('🛡️ Admins Count:', count);
    if (error) console.error('❌ Admins Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/users?role=admin')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Admins"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<ShieldIcon color="primary" />}
      />
    </div>
  );
};

export default TotalAdminsCard;
