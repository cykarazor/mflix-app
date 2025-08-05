// src/admin/cards/TotalMoviesCard.jsx
import { useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import AdminStatCard from '../components/AdminStatCard';
import useAdminCount from '../hooks/useAdminCount';
import { API_BASE_URL } from '../../utils/api';

const TotalMoviesCard = ({ token }) => {
  const navigate = useNavigate();
  const { count, loading, error } = useAdminCount(`${API_BASE_URL}/api/admin/movies?countOnly=true`, token);

  const displayValue = loading ? '...' : error ? 'N/A' : count;

  return (
    <div onClick={() => navigate('/admin/movies')} style={{ cursor: 'pointer' }}>
      <AdminStatCard label="Total Movies" value={displayValue} icon={<MovieIcon color="primary" />} />
    </div>
  );
};

export default TotalMoviesCard;
