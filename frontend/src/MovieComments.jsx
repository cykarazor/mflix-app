import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Box, Divider } from '@mui/material';
import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function MovieComments({ movieId, token }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/comments?movie_id=${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(res.data || []);
      } catch (err) {
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    if (movieId && token) fetchComments();
  }, [movieId, token]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {comments.length === 0 ? (
        <Typography>No comments available.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">{comment.name}</Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      )}
    </Box>
  );
}
