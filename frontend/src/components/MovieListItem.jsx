import { ListItem, Box, Typography } from '@mui/material';
import ThumbsDisplay from './ThumbsDisplay';
import { formatDate } from '../utils/dateHelpers';

export default function MovieListItem({ movie, index, onOpenDetails }) {
  return (
    <ListItem
      divider
      sx={{
        px: 3,
        bgcolor: index % 2 === 0 ? 'grey.100' : 'background.paper',
        cursor: 'pointer',
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 2,
      }}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        onOpenDetails(movie);
      }}
    >
      {/* Poster */}
      {movie.poster && (
        <Box
          component="img"
          src={movie.poster || '/fallback-image.svg'}
          alt={movie.title}
          sx={{ width: 80, height: 120, objectFit: 'cover', borderRadius: 1, flexShrink: 0 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/fallback-image.svg';
          }}
        />
      )}

      {/* Info */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
          {movie.title}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
          Year: {movie.year || 'N/A'} | Rating: {movie.imdb?.rating ?? movie.rating ?? 'N/A'}
          {"\n"}Popularity: {movie.imdb?.votes ?? movie.views ?? 'N/A'}
          {"\n"}Released: {formatDate(movie.released?.$date || movie.dateAdded || movie.released)}
        </Typography>
        <ThumbsDisplay movieId={movie._id} />
      </Box>
    </ListItem>
  );
}
