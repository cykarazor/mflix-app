import { useNavigate } from 'react-router-dom';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalLikesCard = () => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/comments/likes`;

  const { count, loading, error } = useAdminCount(apiPath);

  useEffect(() => {
    console.log('👍 Likes Count:', count);
    if (error) console.error('❌ Likes Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/comments')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Likes"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<ThumbUpIcon color="primary" />}
      />
    </div>
  );
};

export default TotalLikesCard;
