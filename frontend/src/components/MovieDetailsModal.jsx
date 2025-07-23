import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Typography, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import MovieComments from '../MovieComments';
import { formatDate } from '../utils/dateHelpers';

export default function MovieDetailsModal({
  open,
  movie,
  onClose,
  onEdit,
  onAddComment,
  user,
  commentRefreshKey
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {movie?.title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {movie && (
          <Box>
            {movie.poster && (
              <Box
                component="img"
                src={movie.poster}
                alt={movie.title}
                sx={{ width: '100%', borderRadius: 1, mb: 2 }}
              />
            )}
            <Typography variant="body1" gutterBottom><strong>Year:</strong> {movie.year || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Rated:</strong> {movie.rated || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Runtime:</strong> {movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Genres:</strong> {movie.genres?.join(', ') || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Plot:</strong> {movie.plot || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Cast:</strong> {movie.cast?.join(', ') || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Directors:</strong> {movie.directors?.join(', ') || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Languages:</strong> {movie.languages?.join(', ') || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Countries:</strong> {movie.countries?.join(', ') || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Released:</strong> {formatDate(movie.released?.$date || movie.released) || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>IMDb Rating:</strong> {movie.imdb?.rating || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>IMDb Votes:</strong> {movie.imdb?.votes || 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Tomato Meter:</strong> {movie.tomatoes?.viewer?.meter ? `${movie.tomatoes.viewer.meter}%` : 'N/A'}</Typography>
            <Typography variant="body1" gutterBottom><strong>Awards:</strong> {movie.awards?.text || 'N/A'}</Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>Comments</Typography>
              <MovieComments
                movieId={movie._id}
                token={user.token}
                refreshKey={commentRefreshKey}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="outlined" onClick={onAddComment}>Add Comment</Button>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit(movie._id)}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
