import { useEffect, useState, useContext, useCallback } from 'react';
import {
  Typography,
  CircularProgress,
  Box,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import { UserContext } from './UserContext';
import CommentFormModal from './CommentFormModal';
import LikeDislikeButtons from './LikeDislikeButtons';

// Import useSnackbar from centralized context
import { useSnackbar } from './contexts/SnackbarContext';

export default function MovieComments({ movieId, refreshKey }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const { user } = useContext(UserContext);
  const token = user?.token;
  const userEmail = user?.email;

  // Get openSnack from centralized Snackbar context
  const { openSnack } = useSnackbar();

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

  // Add refreshKey to dependencies so comments refresh when it changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshKey]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleOpen = () => {
    setError('');
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleDeleteClick = (comment) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!commentToDelete) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/comments/${commentToDelete._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => prev.filter((c) => c._id !== commentToDelete._id));

      // Use centralized snackbar instead of local snackbar
      openSnack('Comment deleted successfully!', 'success');
      
    } catch (err) {
      setError('Failed to delete comment');

      // Use centralized snackbar for error
      openSnack('Failed to delete comment', 'error');
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  const handleCommentAdded = async () => {
    await fetchComments();

    // Use centralized snackbar for comment added
    openSnack('Comment submitted successfully!', 'success');

  };

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
                on{' '}
                {new Date(comment.date).toLocaleString(undefined, {
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

            {user?.email === comment.email && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => handleDeleteClick(comment)}
              >
                Delete
              </Button>
            )}
            {/* Add LikeDislikeButtons here */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LikeDislikeButtons
                comment={comment}
                token={token}
                userEmail={userEmail}
                onUpdate={fetchComments}
              />
            </Box>

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
            onCommentAdded={handleCommentAdded}
          />
        </>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this comment?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            "{commentToDelete?.text}"
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

     
    </Box>
  );
}
