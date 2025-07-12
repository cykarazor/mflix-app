// src/ThumbsDisplay.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from 'axios';

export default function ThumbsDisplay({ movieId }) {
  const [thumbs, setThumbs] = useState({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchThumbs = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/movies/${movieId}/thumbs`);
        setThumbs(res.data || { up: 0, down: 0 });
      } catch (err) {
        setError('Failed to load thumbs');
      } finally {
        setLoading(false);
      }
    };

    fetchThumbs();
  }, [movieId, API_BASE_URL]);

  if (loading) return <Typography variant="caption">Loading...</Typography>;
  if (error) return <Typography variant="caption" color="error">{error}</Typography>;

  return (
    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ThumbUpIcon fontSize="small" sx={{ mr: 0.5, color: 'green' }} />
        <Typography variant="body2">{thumbs.up}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ThumbDownIcon fontSize="small" sx={{ mr: 0.5, color: 'red' }} />
        <Typography variant="body2">{thumbs.down}</Typography>
      </Box>
    </Stack>
  );
}
