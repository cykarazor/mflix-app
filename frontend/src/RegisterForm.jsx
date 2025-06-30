import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Stack, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RegisterForm = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleRegister = async () => {
    setMsg('');
    if (!name || !email || !password) {
      setMsg('❌ All fields are required.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setMsg('❌ Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setMsg('❌ Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, { name, email, password });
      setMsg('✅ Registration successful! Redirecting to login...');
      setName('');
      setEmail('');
      setPassword('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg(err?.response?.data?.error || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2} maxWidth={400} mx="auto" mt={5}>
      <Typography variant="h5" align="center">
        Register
      </Typography>
      <TextField
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button variant="contained" onClick={handleRegister} fullWidth disabled={loading}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
      </Button>
      {msg && (
        <Typography color={msg.startsWith('✅') ? 'primary' : 'error'} align="center">
          {msg}
        </Typography>
      )}
    </Stack>
  );
};

export default RegisterForm;
