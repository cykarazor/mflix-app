import { useNavigate } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalCommentsCard = () => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/comments/count`;

  const { count, loading, error } = useAdminCount(apiPath);

  useEffect(() => {
    console.log('💬 Comments Count:', count);
    if (error) console.error('❌ Comments Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/comments')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Comments"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<CommentIcon color="primary" />}
      />
    </div>
  );
};

export default TotalCommentsCard;
