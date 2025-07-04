import React, { useEffect, useState, useContext } from 'react';
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
  console.log("User from context:", user);
  const token = user?.token;

 // ✅ Move fetchComments outside useEffect so it can be reused
  const fetchComments = async () => {
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
      console.log("Fetched comments:", res.data.comments); // ✅ Debug
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load comments when movieId or token changes
  useEffect(() => {
    fetchComments();
  }, [movieId, token]);

  const handleOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  if (loading && comments.length === 0) return <CircularProgress />;

  return (
    <Box>
      {comments.length === 0 ? (
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

          {/* ✅ Simplified Comment Form Modal */}
          <CommentFormModal
            open={open}
            onClose={handleClose}
            movieId={movieId}
            onCommentAdded={fetchComments} />
        </>
      )}
    </Box>
  );
}
