// ✅ Imports
import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { useNavigate } from 'react-router-dom';
import useMovies from './hooks/useMovies';

// NEW import for modal state management
import useMovieModals from './hooks/useMovieModals';

// Helper to determine initial ascending value based on sort field
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

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('title');
  const [ascending, setAscending] = useState(getInitialAscending('title'));
  const [page, setPage] = useState(1);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);
  const [isRefreshingMovie, setIsRefreshingMovie] = useState(false);
  const navigate = useNavigate();
  const { openSnack } = useSnackbar();

  // Use existing custom hook to fetch and manage movies
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

  // NEW: Use modal hook to manage all modal state and handlers
  const {
  modals: { isDetailsOpen, isEditOpen, isCommentOpen },
  selectedMovie,
  openDetails,
  openEdit,
  openComment,
  closeDetails,
  closeEdit,
  closeComment,
  closeModals,
} = useMovieModals();


  // Redirect if not logged in
  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    setAscending(getInitialAscending(sort));
  }, [sort]);

  // Refresh movie on update event
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

      if (!response.ok) throw new Error("Failed to fetch updated movie");

      const freshMovie = await response.json();

      setMovies((prevMovies) =>
        prevMovies.map((m) => (m._id === freshMovie._id ? freshMovie : m))
      );

      // If the updated movie is currently selected, update modal state
      if (selectedMovie && freshMovie._id === selectedMovie._id) {
        openDetails(freshMovie);
      }
    } catch (err) {
      console.error("Error refreshing movie:", err);
    } finally {
      setIsRefreshingMovie(false);
    }
  }, [user.token, setMovies, selectedMovie, openDetails]);

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
      {/* Sticky header with search/sort controls */}
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

      {/* Movie List */}
      {!loading && !error && movies.length > 0 && (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          {movies.map((movie, index) => (
            <MovieListItem
              key={movie._id}
              movie={movie}
              index={index}
              onOpenDetails={() => openDetails(movie)} // UPDATED: openDetails from modal hook
            />
          ))}
        </List>
      )}

      {/* Pagination */}
      <PaginationControls page={page} setPage={setPage} totalPages={totalPages} />

      {/* Edit Modal */}
      <EditMovieModal
        editMovieId={selectedMovie?._id} // UPDATED: from modal hook's selectedMovie
        open={isEditOpen}                 // UPDATED: controlled by modal hook
        onClose={closeEdit}             // UPDATED: close all modals
        onUpdated={handleMovieUpdated}
      />

      {/* Movie Details Modal */}
      <MovieDetailsModal
        open={isDetailsOpen}              // UPDATED: modal hook state
        movie={selectedMovie}             // UPDATED: modal hook selected movie
        onClose={closeModals}
        onEdit={() => {
          closeDetails();  // close details modal only
          openEdit(selectedMovie); // open edit modal
        }}
        onAddComment={() => openComment(selectedMovie)}
        showCommentForm={isCommentOpen}
        setShowCommentForm={(val) => val ? openComment(selectedMovie) : closeModals()}
        user={user}
        commentRefreshKey={commentRefreshKey}
        isRefreshingMovie={isRefreshingMovie}
      />

      {/* Add Comment Modal */}
      <CommentFormModal
        open={isCommentOpen}
        onClose={() => {
          closeComment();
          setCommentRefreshKey((prev) => prev + 1);
        }}
        movieId={selectedMovie?._id}
        token={user.token}
        openSnack={openSnack}
      />
    </Container>
  );
}
