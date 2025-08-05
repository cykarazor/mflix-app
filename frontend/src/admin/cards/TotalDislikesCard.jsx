import { useNavigate } from 'react-router-dom';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalDislikesCard = () => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/comments/dislikes`;

  const { count, loading, error } = useAdminCount(apiPath);

  useEffect(() => {
    console.log('👎 Dislikes Count:', count);
    if (error) console.error('❌ Dislikes Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/comments')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Dislikes"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<ThumbDownIcon color="primary" />}
      />
    </div>
  );
};

export default TotalDislikesCard;
