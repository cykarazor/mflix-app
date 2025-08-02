import Header from './Header';
import Footer from './Footer';
import { Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // ✅ import Outlet

const Layout = () => {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet /> {/* ✅ Render the matched child route here */}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
