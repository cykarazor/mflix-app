// src/admin/components/AnalyticsModal.jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

export default function AnalyticsModal({ open, onClose, users = [] }) {
  const [chartType, setChartType] = useState('roleDistribution');

  const roleData = Object.entries(
    users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {})
  ).map(([role, count]) => ({ name: role, value: count }));

  const activeData = [
    { name: 'Active', value: users.filter((u) => u.isActive).length },
    { name: 'Inactive', value: users.filter((u) => !u.isActive).length },
  ];

  const loginData = users.map((u) => ({
    name: u.name || 'Unknown',
    logins: u.loginCount || 0,
  }));

  const renderChart = () => {
    switch (chartType) {
      case 'roleDistribution':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {roleData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'activeStatus':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activeData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'loginActivity':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={loginData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="logins" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>User Analytics</DialogTitle>
      <DialogContent>
        <Box my={2}>
          <FormControl fullWidth>
            <InputLabel>Chart Type</InputLabel>
            <Select
              value={chartType}
              label="Chart Type"
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="roleDistribution">Users by Role</MenuItem>
              <MenuItem value="activeStatus">Active vs Inactive</MenuItem>
              <MenuItem value="loginActivity">Login Activity</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>{renderChart()}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
