import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

const COLORS = ['#4caf50', '#2196f3', '#f44336', '#ff9800', '#9c27b0'];

const AnalyticsModal = ({ open, onClose, users }) => {
  const [chartType, setChartType] = React.useState('role');

  // Prepare role distribution data
  const roleCounts = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});
  const roleData = Object.keys(roleCounts).map((role, index) => ({
    name: role,
    value: roleCounts[role],
    color: COLORS[index % COLORS.length],
  }));

  // Prepare Active vs Inactive data
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.length - activeCount;
  const activeData = [
    { name: 'Active', value: activeCount, color: '#4caf50' },
    { name: 'Inactive', value: inactiveCount, color: '#f44336' },
  ];

  const handleChartChange = (_, newType) => {
    if (newType !== null) setChartType(newType);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>📊 User Analytics</DialogTitle>

      <DialogContent>
        <Box mb={2}>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartChange}
            size="small"
          >
            <ToggleButton value="role">Role Distribution</ToggleButton>
            <ToggleButton value="active">Active vs Inactive</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box height={400}>
          {chartType === 'role' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Users" fill="#2196f3">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={60}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {activeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AnalyticsModal;
