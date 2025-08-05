// frontend/src/admin/components/AdminStatCard.jsx
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';

const AdminStatCard = ({ label, icon, value, loading, error, to }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <Card elevation={4} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" gutterBottom>{label}</Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : error ? (
              <Typography color="error">Error</Typography>
            ) : (
              <Typography variant="h4">{value}</Typography>
            )}
          </Box>
          <Box sx={{ fontSize: 48, opacity: 0.2 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  </Link>
);

export default AdminStatCard;
