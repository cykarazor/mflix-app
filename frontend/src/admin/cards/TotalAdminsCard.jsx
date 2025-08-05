// frontend/src/admin/TotalAdminsCard.jsx
import AdminStatCard from '../components/AdminStatCard';

const TotalAdminsCard = () => {
  const value = 3; // static for now
  return <AdminStatCard label="Total Admins" value={value} />;
};

export default TotalAdminsCard;
