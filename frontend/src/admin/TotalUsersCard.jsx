import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import PeopleIcon from '@mui/icons-material/People';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const TotalUsersCard = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await fetch('/api/admin/users/count');
        const data = await res.json();
        setCount(data.count);
      } catch (err) {
        console.error('Failed to fetch user count', err);
        setCount('N/A');
      }
    };

    fetchUserCount();
  }, []);

  return (
    <Link to="/admin/users" style={{ textDecoration: 'none' }}>
      <StatCard
        label={
          <Box display="flex" alignItems="center" gap={1}>
            <PeopleIcon color="primary" />
            <Typography variant="h6">Users</Typography>
          </Box>
        }
        value={count !== null ? count : '...'}
      />
    </Link>
  );
};

export default TotalUsersCard;
