import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import UsersByRoleChart from './charts/UsersByRoleChart';
import ActiveStatusPieChart from './charts/ActiveStatusPieChart';

export default function AnalyticsModal({ open, onClose, users }) {
  const [chartType, setChartType] = React.useState('role');

  const renderChart = () => {
    switch (chartType) {
      case 'role':
        return <UsersByRoleChart users={users} />;
      case 'active':
        return <ActiveStatusPieChart users={users} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Analytics</DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            fullWidth
          >
            <MenuItem value="role">Users by Role</MenuItem>
            <MenuItem value="active">Active vs Inactive</MenuItem>
            {/* You can add more chart options here */}
          </Select>
        </Box>
        {renderChart()}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
