import AdminStatCard from '../components/AdminStatCard';

const TotalDislikesCard = () => {
  const value = 150;
  return <AdminStatCard label="Dislikes (Thumbs Down)" value={value} />;
};

export default TotalDislikesCard;
