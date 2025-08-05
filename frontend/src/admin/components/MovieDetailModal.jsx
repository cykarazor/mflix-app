// AdminMovieDetailsModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  Stack,
} from '@mui/material';
import dayjs from 'dayjs';

export default function AdminMovieDetailsModal({ open, onClose, movie }) {
  if (!movie) return null;

  const {
    _id,
    title,
    year,
    rated,
    runtime,
    poster,
    genres = [],
    languages = [],
    countries = [],
    type,
    directors = [],
    cast = [],
    plot,
    fullplot,
    imdb = {},
    viewer = {},
    tomatoes = {},
    awards = {},
    released,
    lastupdated,
    num_mflix_comments,
  } = movie;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return dayjs(dateStr).format('YYYY-MM-DD');
  };

  const renderChips = (items) =>
    items.map((item) => (
      <Chip key={item} label={item} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
    ));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>
        {title} ({year})
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* Poster */}
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={poster || '/fallback-poster.jpg'}
              alt={title}
              sx={{ width: '100%', borderRadius: 1, objectFit: 'cover' }}
            />
          </Grid>

          {/* Basic Info */}
          <Grid item xs={12} md={8}>
            <Typography gutterBottom>
              <strong>Rated:</strong> {rated || 'N/A'} | <strong>Runtime:</strong> {runtime} min
            </Typography>
            <Typography gutterBottom>
              <strong>Type:</strong> {type || 'N/A'}
            </Typography>

            <Typography variant="subtitle2" mt={2}>Genres:</Typography>
            {renderChips(genres)}

            <Typography variant="subtitle2" mt={2}>Languages:</Typography>
            {renderChips(languages)}

            <Typography variant="subtitle2" mt={2}>Countries:</Typography>
            {renderChips(countries)}

            <Typography variant="subtitle2" mt={2}>Directors:</Typography>
            <Typography>{directors.join(', ') || 'N/A'}</Typography>

            <Typography variant="subtitle2" mt={2}>Cast:</Typography>
            <Typography>{cast.join(', ') || 'N/A'}</Typography>
          </Grid>

          {/* Plot */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Plot Summary:</Typography>
            <Typography paragraph>{plot || 'N/A'}</Typography>

            <Typography variant="subtitle2">Full Plot:</Typography>
            <Typography paragraph>{fullplot || 'N/A'}</Typography>
          </Grid>

          {/* Ratings */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Ratings:</Typography>
            <Stack spacing={1} mt={1}>
              <Typography>
                <strong>IMDb:</strong> {imdb.rating ?? 'N/A'} ({imdb.votes ?? 0} votes, ID: {imdb.id ?? 'N/A'})
              </Typography>
              <Typography>
                <strong>Viewer Rating:</strong> {viewer.rating ?? 'N/A'} ({viewer.numReviews ?? 0} reviews)
              </Typography>
              <Typography>
                <strong>Tomatoes Viewer:</strong> {tomatoes.viewer?.rating ?? 'N/A'} | Meter: {tomatoes.viewer?.meter ?? 'N/A'}
              </Typography>
              <Typography>
                <strong>Tomatoes Critic:</strong> {tomatoes.critic?.rating ?? 'N/A'} ({tomatoes.critic?.numReviews ?? 0} reviews) | Meter: {tomatoes.critic?.meter ?? 'N/A'}
              </Typography>
            </Stack>
          </Grid>

          {/* Awards */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Awards:</Typography>
            <Typography>{awards.text || 'None'}</Typography>
            <Typography>🏆 Wins: {awards.wins ?? 0}</Typography>
            <Typography>🎯 Nominations: {awards.nominations ?? 0}</Typography>
          </Grid>

          {/* Metadata */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2">Metadata:</Typography>
            <Typography>ID: {_id}</Typography>
            <Typography>Released: {formatDate(released)}</Typography>
            <Typography>Last Updated: {formatDate(lastupdated)}</Typography>
            <Typography>Comments: {num_mflix_comments}</Typography>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
