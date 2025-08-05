import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';

const TotalMoviesCard = () => {
  const navigate = useNavigate();
  const { count, loading, error } = useAdminCount('/api/admin/movies?countOnly=true');

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
