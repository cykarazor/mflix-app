import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { fetchMovieComments, deleteComment, fetchMovieById } from '../../utils/api'; // ✅ NEW IMPORTS

const MovieDetailModal = ({ open, onClose, movie, token, onMovieUpdated }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [errorComments, setErrorComments] = useState(false);

  // ✅ Fetch comments when modal opens
  useEffect(() => {
    if (!open || !movie?._id) return;

    const loadComments = async () => {
      setLoadingComments(true);
      setErrorComments(false);
      try {
        const data = await fetchMovieComments(movie._id, token); // ✅ REPLACED DIRECT FETCH
        setComments(data);
      } catch (err) {
        console.error(err);
        setErrorComments(true);
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [open, movie?._id, token]);

  // ✅ Delete comment handler
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId, token); // ✅ REPLACED DIRECT FETCH
      setComments((prev) => prev.filter((c) => c._id !== commentId));

      // ✅ Refresh movie data after comment delete
      const updatedMovie = await fetchMovieById(movie._id, token);
      onMovieUpdated(updatedMovie);
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment. Try again later.');
    }
  };

  // Helper to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const d = new Date(dateString);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>{movie?.title || 'Movie Details'}</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" gap={3} flexWrap="wrap">
          {/* Poster */}
          <Box flexShrink={0}>
            <img
              src={movie?.poster}
              alt={`${movie?.title} poster`}
              style={{ width: 180, borderRadius: 4, objectFit: 'cover' }}
            />
          </Box>

          {/* Main info */}
          <Box flexGrow={1} minWidth={280}>
            <Typography variant="h6" gutterBottom>
              {movie?.title} ({movie?.year})
            </Typography>

            {/* Genres */}
            <Box mb={1}>
              <Typography variant="subtitle2">Genres:</Typography>
              <Box display="flex" gap={1} flexWrap="wrap" mt={0.5}>
                {movie?.genres?.length > 0 ? (
                  movie.genres.map((g) => (
                    <Chip key={g} label={g} size="small" />
                  ))
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )}
              </Box>
            </Box>

            {/* Runtime */}
            <Typography variant="body2" gutterBottom>
              <strong>Runtime:</strong>{' '}
              {movie?.runtime ? `${movie.runtime} min` : 'N/A'}
            </Typography>

            {/* Directors */}
            <Typography variant="body2" gutterBottom>
              <strong>Director{movie?.directors?.length > 1 ? 's' : ''}:</strong>{' '}
              {movie?.directors?.length
                ? movie.directors.join(', ')
                : 'N/A'}
            </Typography>

            {/* Writers */}
            <Typography variant="body2" gutterBottom>
              <strong>Writer{movie?.writers?.length > 1 ? 's' : ''}:</strong>{' '}
              {movie?.writers?.length ? movie.writers.join(', ') : 'N/A'}
            </Typography>

            {/* Countries */}
            <Typography variant="body2" gutterBottom>
              <strong>Countries:</strong>{' '}
              {movie?.countries?.length ? movie.countries.join(', ') : 'N/A'}
            </Typography>

            {/* Release Date */}
            <Typography variant="body2" gutterBottom>
              <strong>Released:</strong> {formatDate(movie?.released)}
            </Typography>

            {/* Awards (basic) */}
            {movie?.awards && (
              <Typography variant="body2" gutterBottom>
                <strong>Awards:</strong>{' '}
                {movie.awards.text || 'N/A'}
              </Typography>
            )}

            {/* Likes / Dislikes */}
            <Box mt={1} display="flex" gap={2}>
              <Chip label={`👍 ${movie?.likes || 0}`} color="success" />
              <Chip label={`👎 ${movie?.dislikes || 0}`} color="error" />
            </Box>
          </Box>
        </Box>

        {/* Description / Full Plot */}
        <Box mt={3}>
          <Typography variant="subtitle1" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" paragraph>
            {movie?.fullplot || movie?.plot || 'No description available.'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Comments Section */}
        <Typography variant="subtitle1" gutterBottom>
          Comments ({comments.length})
        </Typography>

        {loadingComments && <Typography>Loading comments...</Typography>}
        {errorComments && (
          <Typography color="error">
            Failed to load comments. Please try again later.
          </Typography>
        )}

        {!loadingComments && !errorComments && (
          <>
            {comments.length === 0 && (
              <Typography>No comments available for this movie.</Typography>
            )}
            <List dense>
              {comments.map((comment) => (
                <ListItem key={comment._id} divider>
                  <ListItemText
                    primary={comment.text}
                    secondary={`By ${comment.userName || 'Anonymous'} on ${new Date(
                      comment.createdAt
                    ).toLocaleString()}`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Delete Comment">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MovieDetailModal;
