import { useState, useContext } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UserContext } from './UserContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMsg('');
  setLoading(true);

  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email,
      password,
    });

    const { user, token } = res.data;
    login(user, token);

    // Wait for UserContext to update before redirecting
    // Use a small delay to ensure context has propagated
    setTimeout(() => {
      const target = user.role === 'admin' ? '/admin' : '/movies';
      navigate(target, { replace: true });
    }, 100);

  } catch (err) {
    setMsg(err.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <Box maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      {msg && (
        <Typography color="error" align="center" mt={2}>
          {msg}
        </Typography>
      )}
    </Box>
  );
}
