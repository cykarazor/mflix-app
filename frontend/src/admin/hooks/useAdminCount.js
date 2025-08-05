// frontend/src/admin/hooks/useAdminCount.js
import { useState, useEffect } from 'react';

export default function useAdminCount(apiPath, token) {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('No token provided');
      setLoading(false);
      return;
    }

    async function fetchCount() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiPath, {
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
  }, [apiPath, token]);

  return { count, loading, error };
}
