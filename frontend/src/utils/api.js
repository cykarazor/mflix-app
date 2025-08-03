import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'https://mflix-app-a7wd.onrender.com';

// Public or general movie fetch
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

// ✅ Admin: Fetch all comments for a given movie
export async function fetchMovieComments(movieId, token) {
  const res = await axios.get(`${API_BASE_URL}/api/admin/movies/${movieId}/comments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ Admin: Delete a comment by ID
export async function deleteComment(commentId, token) {
  const res = await axios.delete(`${API_BASE_URL}/api/admin/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ✅ Admin: Fetch single movie by ID (after comment delete or for detail modal)
export async function fetchMovieById(movieId, token) {
  const res = await axios.get(`${API_BASE_URL}/api/admin/movies/${movieId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
