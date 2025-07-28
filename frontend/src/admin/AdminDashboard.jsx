// frontend/src/admin/AdminDashboard.jsx
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const AdminDashboard = () => {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Total Admins</Typography>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">24</Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* More cards can go here */}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
