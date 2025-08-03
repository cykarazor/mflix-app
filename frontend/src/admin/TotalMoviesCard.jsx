// frontend/src/admin/TotalMoviesCard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import { API_BASE_URL } from '../utils/api';

const TotalMoviesCard = ({ token }) => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); // ✅ for navigation on click

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
        console.error('Error fetching movie count:', err);
      }
    };

    fetchMovieCount();
  }, [token]);

  return (
    <div onClick={() => navigate('/admin/movies')} style={{ cursor: 'pointer' }}>
      <StatCard label="Total Movies" value={count} />
    </div>
  );
};

export default TotalMoviesCard;
