import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';
import { API_BASE_URL } from '../../utils/api';
import { useEffect } from 'react';

const TotalMoviesCard = ({ token }) => {
  const navigate = useNavigate();
  const apiPath = `${API_BASE_URL}/api/admin/movies?countOnly=true`;

  const { count, loading, error } = useAdminCount(apiPath, token);

  useEffect(() => {
    console.log('🎬 Movies Count:', count);
    if (error) console.error('❌ Movies Count Error:', error);
  }, [count, error]);

  return (
    <div onClick={() => navigate('/admin/movies')} style={{ cursor: 'pointer' }}>
      <AdminStatCard
        label="Total Movies"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<MovieIcon color="primary" />}
      />
    </div>
  );
};

export default TotalMoviesCard;
