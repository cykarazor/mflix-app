// frontend/src/admin/components/UserDetailModal.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { API_BASE_URL } from '../../utils/api';

/**
 * UserDetailModal shows user info in view mode,
 * allows editing details and password reset,
 * and notifies parent of updates.
 * 
 * Props:
 * - open (bool): whether modal is open
 * - onClose (func): called to close modal
 * - user (object): the user data to display/edit
 * - token (string): authorization token to send in API requests
 * - onUserUpdated (func): callback(updatedUser) called after successful update
 */
const UserDetailModal = ({ open, onClose, user, token, onUserUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    isActive: false,
  });
  const [passwordMode, setPasswordMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility handler
  const handleToggleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // When modal opens or user changes, reset states and form data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        role: user.role || 'user',
        isActive: !!user.isActive,
      });
    }
    setEditMode(false);
    setPasswordMode(false);
    setNewPassword('');
    setError('');
    setPasswordError('');
    setSuccessMsg('');
  }, [user, open]);

  if (!user) return null;

  // Handle changes in form inputs (text/select/checkbox)
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };


  // Save edited user details
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccessMsg('');

    console.log('Sending to backend:', formData);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use token from props
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to save user data');
      }
      const updatedUser = await res.json();
      setSuccessMsg('User details updated successfully');
      setEditMode(false);
      // Notify parent of the update
      if (onUserUpdated) onUserUpdated(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Reset user password
  const handlePasswordReset = async () => {
  if (newPassword.length < 6) {
    setPasswordError('Password must be at least 6 characters');
    return;
  }
  if (newPassword !== confirmPassword) {
    setPasswordError('Passwords do not match');
    return;
  }
  setPasswordSaving(true);
  setPasswordError('');
  setSuccessMsg('');
  try {
    const res = await fetch(`${API_BASE_URL}/api/admin/users/${user._id}/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to reset password');
    }
    setSuccessMsg('Password reset successfully');
    setPasswordMode(false);
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    setPasswordError(err.message);
  } finally {
    setPasswordSaving(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        User Details
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Show error and success messages */}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}

        {/* View mode: show user info */}
        {!editMode ? (
          <Box>
            <Typography><strong>Name:</strong> {user.name}</Typography>
            <Typography><strong>Email:</strong> {user.email}</Typography>
            <Typography><strong>Role:</strong> {user.role}</Typography>
            <Typography><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</Typography>
            <Typography><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Typography>
            <Typography><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</Typography>
          </Box>
        ) : (
          // Edit mode: form inputs
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Email"
              value={user.email}
              fullWidth
              disabled
              helperText="Email cannot be changed"
            />
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        )}

        {/* Buttons below info */}
        {!editMode && !passwordMode && (
          <Box mt={2}>
            <Button variant="outlined" onClick={() => setEditMode(true)} sx={{ mr: 2 }}>
              Edit
            </Button>
            <Button variant="outlined" onClick={() => setPasswordMode(true)} color="secondary">
              Reset Password
            </Button>
          </Box>
        )}

        {/* Password reset form */}
        {passwordMode && (
          <Box mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
            label="New Password"
            type={showPassword ? 'text' : 'password'}  // toggle type
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            autoFocus
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}  // toggle type
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={handleToggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handlePasswordReset}
                disabled={passwordSaving}
              >
                {passwordSaving ? <CircularProgress size={24} /> : 'Save Password'}
              </Button>
              <Button variant="outlined" onClick={() => setPasswordMode(false)}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Actions for editing */}
      {editMode && (
        <DialogActions>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setEditMode(false);
              setFormData({
                name: user.name,
                role: user.role,
                isActive: user.isActive,
              });
              setError('');
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UserDetailModal;
