// frontend/src/admin/StatCard.jsx
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatCard = ({ label, value, icon }) => (
  <Card elevation={4}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={1}>
        {icon && <Box mr={1}>{icon}</Box>}
        <Typography variant="h6">{label}</Typography>
      </Box>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;
