// src/admin/cards/TotalUsersCard.jsx
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AdminStatCard from '../components/AdminStatCard';
import useAdminCount from '../hooks/useAdminCount';
import { API_BASE_URL } from '../../utils/api';

const TotalUsersCard = ({ token }) => {
  const navigate = useNavigate();
  const { count, loading, error } = useAdminCount(`${API_BASE_URL}/api/admin/users/count`, token);

  const displayValue = loading ? '...' : error ? 'N/A' : count;

  return (
    <div onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
      <AdminStatCard label="Total Users" value={displayValue} icon={<PeopleIcon color="primary" />} />
    </div>
  );
};

export default TotalUsersCard;
