// frontend/src/admin/StatCard.jsx
import { Card, CardContent, Typography } from '@mui/material';

const StatCard = ({ label, value }) => (
  <Card elevation={4}>
    <CardContent>
      <Typography variant="h6" gutterBottom>{label}</Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;
