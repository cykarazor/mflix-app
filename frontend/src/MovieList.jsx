// ✅ Imports
import { useState, useEffect, useContext, useCallback } from 'react';
import {
  Container, Typography, List, Stack,
  CircularProgress, 
  Box
} from '@mui/material';

import { UserContext } from './UserContext';
import EditMovieModal from './EditMovieModal';
import CommentFormModal from './CommentFormModal';
import MovieListHeader from './components/MovieListHeader';
import PaginationControls from './components/PaginationControls';
import MovieDetailsModal from './components/MovieDetailsModal';
import socket from './socket';
import { useSnackbar } from './contexts/SnackbarContext';
import MovieListItem from './components/MovieListItem';

// ✅ Helper to determine initial ascending value based on sort field
const getInitialAscending = (sortField) => {
  switch (sortField) {
    case 'title':
      return true;
    case 'year':
    case 'dateAdded':
    case 'rating':
    case 'popularity':
      return false;
    default:
      return true;
  }
};

export default function MovieList() {
  const { user } = useContext(UserContext);

  // const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [ascending, setAscending] = useState(getInitialAscending('title'));
  // const [loading] = useState(false);
 // const [error, setError] = useState('');
  const [page, setPage] = useState(1);
 // const [totalPages, setTotalPages] = useState(1);
  const [editMovieId, setEditMovieId] = useState(null);
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [isRefreshingMovie, setIsRefreshingMovie] = useState(false);
  //const initialMovieSet = useRef(false);

  const { openSnack } = useSnackbar();
  //console.log('✅ openSnack passed to MovieList:', typeof openSnack); // 🔍 Confirm it's a function

  // ✅ Redirect to login if no user token
  useEffect(() => {
  if (!user?.token) {
    navigate('/login');
  }
}, [user, navigate]);

  useEffect(() => {
    setAscending(getInitialAscending(sort));
  }, [sort]);

  // ✅ Load movies based on search, sort, pagination
  const {
      movies,
      loading,
      error,
      totalPages,
      setMovies,
    } = useMovies({
      search,
      sort,
      ascending,
      page,
      token: user?.token,
    });

  const openDetailsModal = (movie) => setDetailsMovie(movie);
  const closeDetailsModal = () => setDetailsMovie(null);
  const handleCloseEditModal = () => setEditMovieId(null);

  // ✅ Refresh movie on update event
  const handleMovieUpdated = useCallback(async (updatedMovie) => {
    if (!updatedMovie || !updatedMovie._id) {
      console.warn('⚠️ Invalid movie passed to handleMovieUpdated:', updatedMovie);
      return;
    }

    setIsRefreshingMovie(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/movies/${updatedMovie._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

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
  }, [user.token]);

  useEffect(() => {
    const movieUpdatedListener = (updatedMovie) => {
      console.log('Socket event movieUpdated received:', updatedMovie);
      handleMovieUpdated(updatedMovie);
    };

    socket.on('movieUpdated', movieUpdatedListener);
    return () => socket.off('movieUpdated', movieUpdatedListener);
  }, [handleMovieUpdated]);

  return (
    <Container sx={{ py: 4 }}>
      {/* ✅ Sticky header with search/sort controls */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: 'background.paper', py: 1 }}>
        <MovieListHeader
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
          ascending={ascending}
          setAscending={setAscending}
        />
      </Box>

      {/* Loading spinner */}
      {loading && (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      )}

      {/* Error state */}
      {!loading && error && (
        <Typography color="error" textAlign="center">{error}</Typography>
      )}

      {/* No results */}
      {!loading && !error && movies.length === 0 && (
        <Typography textAlign="center">No movies found.</Typography>
      )}

      {/* ✅ Movie List */}
        {!loading && !error && movies.length > 0 && (
          <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
            {movies.map((movie, index) => (
              <MovieListItem
                key={movie._id}
                movie={movie}
                index={index}
                onOpenDetails={openDetailsModal}
              />
            ))}
          </List>
        )}

      {/* Pagination */}
      <PaginationControls page={page} setPage={setPage} totalPages={totalPages} />

      {/* Edit Modal */}
      <EditMovieModal
        editMovieId={editMovieId}
        onClose={handleCloseEditModal}
        onUpdated={handleMovieUpdated}
      />

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
        openSnack={openSnack}
      />
    </Container>
  );
}
