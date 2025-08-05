// frontend/src/admin/hooks/useAdminCount.js
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';

export default function useAdminCount(apiPath) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token provided');
      setLoading(false);
      setCount(null);
      return;
    }

    async function fetchCount() {
      setLoading(true);
      setError(null);
      try {
        const url = apiPath.startsWith('http') ? apiPath : `${API_BASE_URL}${apiPath}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data = await res.json();
        setCount(data.count ?? 0);
      } catch (err) {
        setError(err.message);
        setCount(null);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, [apiPath]);

  return { count, loading, error };
}
