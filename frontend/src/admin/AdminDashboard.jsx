// frontend/src/admin/AdminDashboard.jsx
import { Grid, Box, Typography } from '@mui/material';

import TotalAdminsCard from './TotalAdminsCard';
import TotalUsersCard from './TotalUsersCard';
import TotalMoviesCard from './TotalMoviesCard';
import TotalCommentsCard from './TotalCommentsCard';
import TotalLikesCard from './TotalLikesCard';
import TotalDislikesCard from './TotalDislikesCard';

const AdminDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}><TotalAdminsCard /></Grid>
        <Grid item xs={12} sm={6} md={4}><TotalUsersCard /></Grid>
        <Grid item xs={12} sm={6} md={4}><TotalMoviesCard /></Grid>
        <Grid item xs={12} sm={6} md={4}><TotalCommentsCard /></Grid>
        <Grid item xs={12} sm={6} md={4}><TotalLikesCard /></Grid>
        <Grid item xs={12} sm={6} md={4}><TotalDislikesCard /></Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
