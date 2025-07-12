// src/UserProfile.jsx
import React, { useContext } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
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
