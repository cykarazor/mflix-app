import { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, List, ListItem, Button, Stack,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { UserContext } from './UserContext';
import { fetchMovies } from './utils/api'; // Assuming you have this helper
import EditMovieForm from './EditMovieForm';
import MovieComments from './MovieComments';
import CommentFormModal from './CommentFormModal';
import ThumbsDisplay from './ThumbsDisplay';
import MovieListHeader from './components/MovieListHeader'; // ✅ NEW header component
import { formatDate } from './utils/dateHelpers';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

export default function MovieList() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [ascending, setAscending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editMovieId, setEditMovieId] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);

  // ✅ Automatically adjust sort direction based on selected field
  useEffect(() => {
    switch (sort) {
      case 'title':
        setAscending(true);
        break;
      case 'year':
      case 'dateAdded':
      case 'rating':
      case 'popularity':
        setAscending(false);
        break;
      default:
        setAscending(true);
    }
  }, [sort]);

  // Fetch movies
  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovies({
          page,
          limit: PAGE_SIZE,
          sortBy: sort,
          sortOrder: ascending ? 'asc' : 'desc',
          search,
          token: user.token,
        });
        setMovies(data.movies || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [page, sort, ascending, search, user, navigate]);

  const openDetailsModal = (movie) => setDetailsMovie(movie);
  const closeDetailsModal = () => setDetailsMovie(null);
  const handleCloseEditModal = () => setEditMovieId(null);

  const handleMovieUpdated = (updatedMovie) => {
    setMovies(prev =>
      prev.map(movie => (movie._id === updatedMovie._id ? updatedMovie : movie))
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      {/* ❌ OLD HEADER CODE — NOW REPLACED WITH COMPONENT */}
      {/* 
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        MFlix Movies
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        ...
      </Stack>
      */}

      {/* ✅ NEW HEADER COMPONENT */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          paddingY: 1,
        }}
      >
        <MovieListHeader
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          ascending={ascending}
          setAscending={setAscending}
        />
      </Box>

      {/* Loader */}
      {loading && (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}

      {/* Error */}
      {!loading && error && (
        <Typography color="error" sx={{ textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      {/* No Movies */}
      {!loading && !error && movies.length === 0 && (
        <Typography sx={{ textAlign: 'center' }}>No movies found.</Typography>
      )}

      {/* Movie List */}
      {!loading && !error && movies.length > 0 && (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          {movies.map((movie, index) => (
            <ListItem
              key={movie._id}
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
                openDetailsModal(movie);
              }}
            >
              {/* Poster Image */}
              {movie.poster && (
                <Box
                  component="img"
                  src={movie.poster || '/fallback-image.svg'}
                  alt={movie.title}
                  sx={{
                    width: 80,
                    height: 120,
                    objectFit: 'cover',
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/fallback-image.svg';
                  }}
                />
              )}

              {/* Movie Info */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium', wordBreak: 'break-word' }}>
                  {movie.title}
                </Typography>

                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mt: 0.5 }}>
                  Year: {movie.year || 'N/A'} | Rating: {movie.imdb?.rating ?? movie.rating ?? 'N/A'}
                  {"\n"}Popularity: {movie.imdb?.votes ?? movie.views ?? 'N/A'}
                  {"\n"}Released: {formatDate(movie.released?.$date || movie.dateAdded || movie.released)}
                </Typography>

                {/* 👍 Thumbs Display */}
                <ThumbsDisplay movieId={movie._id} />
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => setPage(1)} disabled={page === 1} startIcon={<FirstPageIcon />}>
            <Box display={{ xs: 'none', sm: 'inline' }}>First</Box>
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            startIcon={<NavigateBeforeIcon />}
          >
            <Box display={{ xs: 'none', sm: 'inline' }}>Prev</Box>
          </Button>
          <Typography variant="body2" sx={{ alignSelf: 'center', px: 1 }}>
            Page {page} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            endIcon={<NavigateNextIcon />}
          >
            <Box display={{ xs: 'none', sm: 'inline' }}>Next</Box>
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            endIcon={<LastPageIcon />}
          >
            <Box display={{ xs: 'none', sm: 'inline' }}>Last</Box>
          </Button>
        </Stack>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editMovieId} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Movie Details</DialogTitle>
        <DialogContent dividers>
          {editMovieId && (
            <EditMovieForm
              movieId={editMovieId}
              onClose={handleCloseEditModal}
              onUpdated={(data) => {
                handleMovieUpdated(data);
                handleCloseEditModal();
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Movie Details Modal */}
      <Dialog open={!!detailsMovie} onClose={closeDetailsModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {detailsMovie?.title}
          <IconButton
            aria-label="close"
            onClick={closeDetailsModal}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailsMovie && (
            <Box>
              {detailsMovie.poster && (
                <Box
                  component="img"
                  src={detailsMovie.poster}
                  alt={detailsMovie.title}
                  sx={{ width: '100%', borderRadius: 1, mb: 2 }}
                />
              )}
              <Typography variant="body1" gutterBottom><strong>Year:</strong> {detailsMovie.year || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Rated:</strong> {detailsMovie.rated || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Runtime:</strong> {detailsMovie.runtime ? `${detailsMovie.runtime} minutes` : 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Genres:</strong> {detailsMovie.genres?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Plot:</strong> {detailsMovie.plot || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Cast:</strong> {detailsMovie.cast?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Directors:</strong> {detailsMovie.directors?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Languages:</strong> {detailsMovie.languages?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Countries:</strong> {detailsMovie.countries?.join(', ') || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Released:</strong> {formatDate(detailsMovie.released?.$date || detailsMovie.released) || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>IMDb Rating:</strong> {detailsMovie.imdb?.rating || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>IMDb Votes:</strong> {detailsMovie.imdb?.votes || 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Tomato Meter:</strong> {detailsMovie.tomatoes?.viewer?.meter ? `${detailsMovie.tomatoes.viewer.meter}%` : 'N/A'}</Typography>
              <Typography variant="body1" gutterBottom><strong>Awards:</strong> {detailsMovie.awards?.text || 'N/A'}</Typography>

              {/* Comments */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Comments</Typography>
                <MovieComments
                  movieId={detailsMovie._id}
                  token={user.token}
                  refreshKey={commentRefreshKey}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetailsModal}>Close</Button>
          <Button
            variant="outlined"
            onClick={() => setShowCommentForm(true)}
          >
            Add Comment
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setEditMovieId(detailsMovie._id);
              closeDetailsModal();
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Comment Modal */}
      <CommentFormModal
        open={showCommentForm}
        onClose={() => {
          setShowCommentForm(false);
          setCommentRefreshKey(prev => prev + 1);
        }}
        movieId={detailsMovie?._id}
        token={user.token}
      />
    </Container>
  );
}
