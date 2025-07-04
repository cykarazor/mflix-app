import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from './UserContext';
import CommentFormModal from './CommentFormModal';

export default function MovieComments({ movieId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const { user } = useContext(UserContext);
  const token = user?.token;

  // ✅ useCallback prevents infinite loops & satisfies eslint
  const fetchComments = useCallback(async () => {
  if (!movieId) return;
  setLoading(true);
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/api/comments?movie_id=${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setComments(res.data.comments || []);
  } catch (err) {
    setError('Failed to load comments');
  } finally {
    setLoading(false);
  }
}, [movieId, token]);

useEffect(() => {
  fetchComments();
}, [fetchComments]);

  const handleOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <Box>
      {loading && comments.length === 0 ? (
        <CircularProgress />
      ) : comments.length === 0 ? (
        <Typography>No comments available.</Typography>
      ) : (
        comments.map((comment) => (
          <Box key={comment._id} sx={{ mb: 2 }}>
            <Typography variant="subtitle2">
              {comment.name}{' '}
              <Typography component="span" variant="caption" color="text.secondary">
                on {new Date(comment.date).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
              {comment.text}
            </Typography>
            <Divider sx={{ my: 1 }} />
          </Box>
        ))
      )}

      {error && <Typography color="error">{error}</Typography>}

      {user && (
        <>
          <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpen} disabled={loading}>
            Leave a Comment
          </Button>

          {loading && comments.length > 0 && (
            <CircularProgress size={24} sx={{ ml: 2, verticalAlign: 'middle' }} />
          )}

          <CommentFormModal
            open={open}
            onClose={handleClose}
            movieId={movieId}
            onCommentAdded={fetchComments}
          />
        </>
      )}
    </Box>
  );
}
