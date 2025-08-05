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
import CustomPagination from '../components/CustomPagination';

const AdminMoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useUser();

  const [pageSize, setPageSize] = useState(() =>
    Number(localStorage.getItem('adminMoviesPageSize')) || 10
  );
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleSearchChange = useCallback((value) => {
  setSearch(value);
  setPage(0); // Reset to first page on new search
}, []);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('pageSize', pageSize);

      if (search.trim()) {
        params.append('search', search.trim());
      }
      if (yearFilter) {
        params.append('year', yearFilter);
      }

      const requestUrl = `${API_BASE_URL}/api/admin/movies?${params.toString()}`;

      // ✅ DEBUG LOGS
      console.log('[DEBUG] Fetching movies...');
      console.log('[DEBUG] page:', page, 'pageSize:', pageSize);
      console.log('[DEBUG] URL:', requestUrl);

      const res = await fetch(requestUrl, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch movies');

      const data = await res.json();

      console.log('[DEBUG] Movies received:', data.movies.length);
      console.log('[DEBUG] Total count:', data.totalCount);
      //console.log('[DEBUG] Sample movie:', data.movies[0]);

      const sample = data.movies[0];
      console.log('[DEBUG] Sample movie:', {
        title: sample?.title,
        year: sample?.year,
        genres: sample?.genres,
        likes: sample?.likes,
        dislikes: sample?.dislikes,
      });


      setMovies(data.movies);
      setTotalCount(data.totalCount);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, user.token, search, yearFilter]);

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
  {
    field: 'title',
    headerName: 'Title',
    flex: 1.5,
    renderCell: (params) => {
      const index = movies.findIndex((m) => m._id === params.row._id);
      const globalIndex = page * pageSize + index + 1;
      return (
        <>
          <span>{globalIndex}. </span>
          {params.row.title}
        </>
      );
    },
  },
  { field: 'year', headerName: 'Year', width: 100 },
  {
    field: 'genres',
    headerName: 'Genre',
    flex: 1,
    renderCell: (params) => (params.row.genres || []).join(', ')
  },
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
          onSearchChange={handleSearchChange}
          yearFilter={yearFilter}
          onYearChange={(val) => {
            setYearFilter(val);
            setPage(0); // Reset to first page on new year filter
          }}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Typography variant="h6">Movie Table</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowAnalytics(true)}>
            View Analytics
          </Button>
        </Box>
        <DataGrid
          rows={movies}
          columns={columns}
          getRowId={(row) => row._id}
          pagination                          // ✅ Enable built-in pagination UI
          paginationMode="server"            // ✅ Tell it to request data from server
          page={page}
          pageSize={pageSize}
          rowCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newPageSize) => {
            setPageSize(newPageSize);
            setPage(0); // reset to first page
            localStorage.setItem('adminMoviesPageSize', newPageSize);
          }}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
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
        movies={movies}
      />
    </Box>
  );
};

export default AdminMoviesPage;
