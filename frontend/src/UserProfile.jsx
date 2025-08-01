// src/UserProfile.jsx
import React, { useContext } from 'react';
import { Box, Typography, Paper, Divider, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

const UserProfile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return (
      <Typography variant="h6" color="error">
        User not logged in.
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Name:</Typography>
        <Typography variant="body1">{user.name}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Email:</Typography>
        <Typography variant="body1">{user.email}</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Last Login:</Typography>
        <Typography variant="body1">
          {user.lastLogin
            ? new Date(user.lastLogin).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'N/A'}
        </Typography>
      </Box>

      {/* Change Password Button */}
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/change-password"
        >
          Change Password
        </Button>
      </Box>     
    </Paper>
  );
};

export default UserProfile;
