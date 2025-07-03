// src/CommentFormModal.jsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, Typography
} from '@mui/material';
import { useUser } from './UserContext';
import axios from 'axios';

export default function CommentFormModal({ open, onClose, movieId, token, onCommentAdded }) {
  const { user } = useUser();
  const token = user?.token;
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
  if (!text.trim()) {
    setError('Comment cannot be empty');
    return;
  }

  setLoading(true);
  setError('');
  try {
    //console.log('Token:', token);
    console.log("Token from context:", token);
    console.log("User object:", user);
    
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments`,
      {
        movie_id: movieId,
        text,
        name: user.name,
        email: user.email,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.status === 201) {
      setText('');
      onCommentAdded(); // Notify parent to refresh comments
      onClose();
    } else {
      setError('Failed to submit comment (unexpected response)');
      console.error('Unexpected response:', response);
    }
  } catch (err) {
        console.error('Submit comment error full:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        setError(`Failed: ${err.response.data.error || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server');
      } else {
        console.error('Error message:', err.message);
        setError(`Error: ${err.message}`);
  }
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add a Comment</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Your Comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
