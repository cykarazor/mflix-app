import { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from '../../UserContext';
import { API_BASE_URL } from '../../utils/api';
import MovieDetailModal from '../components/MovieDetailModal';
import MovieFilters from '../components/MovieFilters';
import AnalyticsModal from '../components/AnalyticsModal';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useUser();
  const [pageSize, setPageSize] = useState(() => {
    return Number(localStorage.getItem('adminMoviesPageSize')) || 10;
  });
  const [page, setPage] = useState(0);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Apply filters
  useEffect(() => {
    let filtered = movies || [];
    const lowerSearch = search.trim().toLowerCase();

    if (lowerSearch) {
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(lowerSearch) ||
          (m.director?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    if (yearFilter) {
      filtered = filtered.filter((m) => m.year?.toString() === yearFilter);
    }

    setFilteredMovies(filtered);
  }, [movies, search, yearFilter]);

  // Fetch movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/movies`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setMovies(data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    if (user?.token) {
      fetchMovies();
    }
  }, [user?.token, fetchMovies]);

  const handleRowClick = (params) => {
    setSelectedMovie(params.row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleMovieUpdated = (updatedMovie) => {
    setMovies((prev) =>
      prev.map((m) => (m._id === updatedMovie._id ? updatedMovie : m))
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">
          ⚠️ Failed to load movies. Please try again later.
        </Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: 'poster',
      headerName: 'Poster',
      width: 90,
      renderCell: (params) => (
        <img
          src={params.row.poster}
          alt="poster"
          style={{ width: 50, height: 70, objectFit: 'cover' }}
        />
      ),
    },
    { field: 'title', headerName: 'Title', flex: 1.5 },
    { field: 'year', headerName: 'Year', width: 100 },
    { field: 'genre', headerName: 'Genre', flex: 1 },
    {
      field: 'likes',
      headerName: '👍 Likes',
      width: 100,
      renderCell: (params) => (
        <Chip label={params.row.likes || 0} color="success" size="small" />
      ),
    },
    {
      field: 'dislikes',
      headerName: '👎 Dislikes',
      width: 110,
      renderCell: (params) => (
        <Chip label={params.row.dislikes || 0} color="error" size="small" />
      ),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All Movies
      </Typography>

      <Box display="flex" flexDirection="column" flex={1} minHeight="0">
        <MovieFilters
          search={search}
          onSearchChange={setSearch}
          yearFilter={yearFilter}
          onYearChange={setYearFilter}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Typography variant="h6">Movie Table</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowAnalytics(true)}>
            View Analytics
          </Button>
        </Box>
        <DataGrid
          rows={filteredMovies || []}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationModel={{ pageSize, page }}
          onPaginationModelChange={(model) => {
            setPageSize(model.pageSize);
            setPage(model.page);
            localStorage.setItem('adminMoviesPageSize', model.pageSize);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          paginationMode="client"
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      {selectedMovie && (
        <MovieDetailModal
          open={isModalOpen}
          onClose={handleModalClose}
          movie={selectedMovie}
          token={user.token}
          onMovieUpdated={handleMovieUpdated}
        />
      )}

      <AnalyticsModal
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        movies={filteredMovies}
      />
    </Box>
  );
};

export default AdminMoviesPage;
