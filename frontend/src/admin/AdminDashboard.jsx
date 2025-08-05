// frontend/src/admin/AdminDashboard.jsx
import { useContext } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import TotalAdminsCard from './cards/TotalAdminsCard';
import TotalUsersCard from './cards/TotalUsersCard';
import TotalMoviesCard from './cards/TotalMoviesCard';
import TotalCommentsCard from './cards/TotalCommentsCard';
import TotalLikesCard from './cards/TotalLikesCard';
import TotalDislikesCard from './cards/TotalDislikesCard';
import { UserContext } from '../UserContext';

const AdminDashboard = () => {
  const { token } = useContext(UserContext);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* User & Movie Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TotalAdminsCard token={token} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalUsersCard token={token} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalMoviesCard token={token} />
        </Grid>
      </Grid>

      {/* Grouped: Comments Overview */}
      <Typography variant="h6" mt={5} gutterBottom>
        Comments Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TotalCommentsCard token={token} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalLikesCard token={token} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalDislikesCard token={token} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
