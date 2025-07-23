import { useState, useEffect, useContext } from 'react';
import {
  Container, Typography, List, ListItem, Button, Stack,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions,
  Box
} from '@mui/material';

import { UserContext } from './UserContext';
import { fetchMovies } from './utils/api'; // Assuming you have this helper
import EditMovieForm from './EditMovieForm';
import CommentFormModal from './CommentFormModal';
import ThumbsDisplay from './ThumbsDisplay';
import MovieListHeader from './components/MovieListHeader'; // ✅ NEW header component
import { formatDate } from './utils/dateHelpers';
import { useNavigate } from 'react-router-dom';
import PaginationControls from './components/PaginationControls';
import MovieDetailsModal from './components/MovieDetailsModal';
import socket from './socket';


const PAGE_SIZE = 10;

// Main MovieList component
export default function MovieList() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State variables
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
  const [isRefreshingMovie, setIsRefreshingMovie] = useState(false);

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

  // Socket event listeners
  useEffect(() => {
    socket.on('movieUpdated', handleMovieUpdated);

    return () => {
      socket.off('movieUpdated', handleMovieUpdated); // Cleanup
    };
  }, [user]);

  const openDetailsModal = (movie) => setDetailsMovie(movie);
  const closeDetailsModal = () => setDetailsMovie(null);
  const handleCloseEditModal = () => setEditMovieId(null);

  // Handle movie update function
  const handleMovieUpdated = async (updatedMovie) => {
  setIsRefreshingMovie(true);
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/movies/${updatedMovie._id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch updated movie");
    }

    const freshMovie = await response.json();

    setMovies((prevMovies) =>
      prevMovies.map((m) => (m._id === freshMovie._id ? freshMovie : m))
    );

    setDetailsMovie(freshMovie);
  } catch (err) {
    console.error("Error refreshing movie:", err);
  } finally {
    setIsRefreshingMovie(false);
  }
};


  return (
    <Container sx={{ py: 4 }}>
      
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
      <PaginationControls page={page} setPage={setPage} totalPages={totalPages} />


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
        <MovieDetailsModal
          open={!!detailsMovie}
          movie={detailsMovie}
          onClose={closeDetailsModal}
          onEdit={(id) => {
            setEditMovieId(id);
            closeDetailsModal();
          }}
          onAddComment={() => setShowCommentForm(true)}
          showCommentForm={showCommentForm}
          setShowCommentForm={setShowCommentForm}
          user={user}
          commentRefreshKey={commentRefreshKey}
          isRefreshingMovie={isRefreshingMovie}
        />

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
