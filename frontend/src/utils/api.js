import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://mflix-app-a7wd.onrender.com';

export async function fetchMovies({ page, limit, sortBy, sortOrder, search, token }) {
  const params = new URLSearchParams({
    page,
    limit,
    sortBy,
    sortOrder,
    search,
  });

  const res = await axios.get(`${API_BASE_URL}/api/movies?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
}
