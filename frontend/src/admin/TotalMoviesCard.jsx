// frontend/src/admin/TotalMoviesCard.jsx
import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import { API_BASE_URL } from '../utils/api';

const TotalMoviesCard = ({ token, onClick }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchMovieCount = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/movies?countOnly=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch movie count');
        const data = await res.json();
        setCount(data.count || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovieCount();
  }, [token]);

  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <StatCard label="Total Movies" value={count} />
    </div>
  );
};

export default TotalMoviesCard;
