import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import useAdminCount from '../hooks/useAdminCount';
import AdminStatCard from '../components/AdminStatCard';

const TotalUsersCard = () => {
  const { count, loading, error } = useAdminCount('/api/admin/users/count');

  return (
    <Link to="/admin/users" style={{ textDecoration: 'none' }}>
      <AdminStatCard
        label="Total Users"
        value={loading ? '...' : error ? 'N/A' : count}
        icon={<PeopleIcon color="primary" />}
      />
    </Link>
  );
};

export default TotalUsersCard;
