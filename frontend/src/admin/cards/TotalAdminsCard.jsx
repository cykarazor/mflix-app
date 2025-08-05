// frontend/src/admin/TotalAdminsCard.jsx
import StatCard from '../StatCard';

const TotalAdminsCard = () => {
  const value = 3; // static for now
  return <StatCard label="Total Admins" value={value} />;
};

export default TotalAdminsCard;
