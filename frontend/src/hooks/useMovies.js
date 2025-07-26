import { useState, useEffect, useRef } from 'react';
import { fetchMovies } from '../utils/api';

const PAGE_SIZE = 10;

export const useMovies = ({ search, sort, ascending, page, token }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const initialMovieSet = useRef(false);

  useEffect(() => {
    if (!token) return;

    const loadMovies = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchMovies({
          page,
          limit: PAGE_SIZE,
          sortBy: sort,
          sortOrder: ascending ? 'asc' : 'desc',
          search,
          token,
        });

        const fetched = data.movies || [];
        setMovies(fetched);
        setTotalPages(data.totalPages || 1);
        if (!initialMovieSet.current && fetched.length > 0) {
          initialMovieSet.current = true;
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [search, sort, ascending, page, token]);

  return { movies, loading, error, totalPages, setMovies };
};
export default useMovies;
