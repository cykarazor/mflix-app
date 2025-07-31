import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const roles = ['admin', 'user'];

const UserDetailModal = ({ open, onClose, user, onSave, onChangePassword }) => {
  const [formData, setFormData] = React.useState(user || {});

  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit User
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={formData.name || ''}
            fullWidth
            onChange={(e) => handleChange('name', e.target.value)}
          />

          <TextField
            label="Email"
            value={formData.email || ''}
            fullWidth
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            select
            label="Role"
            value={formData.role || 'user'}
            fullWidth
            onChange={(e) => handleChange('role', e.target.value)}
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive || false}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
            }
            label="Active"
          />

          <Typography variant="body2" color="textSecondary">
            Joined: {formData.createdAt ? new Date(formData.createdAt).toLocaleString() : 'N/A'}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            Last Login: {formData.lastLogin ? new Date(formData.lastLogin).toLocaleString() : 'Never'}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="error" onClick={onChangePassword}>
          Change Password
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;
