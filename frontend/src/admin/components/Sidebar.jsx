// src/admin/components/Sidebar.jsx
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import GroupIcon from '@mui/icons-material/Group';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MovieIcon from '@mui/icons-material/Movie';
import CommentIcon from '@mui/icons-material/Comment';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Stats (replace with API data or props later)
  const stats = {
    admins: 3,
    users: 120,
    movies: 45,
    comments: 178,
    likes: 540,
    dislikes: 32,
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose(); // Close drawer on mobile after selection
    }
  };

  const drawerContent = (
    <>
      <Toolbar />
      <Divider />
      <Box p={2}>
        <Typography variant="h6">Admin Panel Stats</Typography>
        <List>
          <ListItemButton onClick={() => handleMenuClick('/admin/users?role=admin')}>
            <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
            <ListItemText primary={`Admins: ${stats.admins}`} />
          </ListItemButton>

          <ListItemButton onClick={() => handleMenuClick('/admin/users?role=user')}>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary={`Users: ${stats.users}`} />
          </ListItemButton>

          <ListItemButton onClick={() => handleMenuClick('/admin/movies')}>
            <ListItemIcon><MovieIcon /></ListItemIcon>
            <ListItemText primary={`Movies: ${stats.movies}`} />
          </ListItemButton>

          <ListItemButton onClick={() => handleMenuClick('/admin/comments')}>
            <ListItemIcon><CommentIcon /></ListItemIcon>
            <ListItemText primary={`Comments: ${stats.comments}`} />
          </ListItemButton>

          <ListItemButton onClick={() => handleMenuClick('/admin/likes')}>
            <ListItemIcon><ThumbUpIcon color="success" /></ListItemIcon>
            <ListItemText primary={`Likes: ${stats.likes}`} />
          </ListItemButton>

          <ListItemButton onClick={() => handleMenuClick('/admin/dislikes')}>
            <ListItemIcon><ThumbDownIcon color="error" /></ListItemIcon>
            <ListItemText primary={`Dislikes: ${stats.dislikes}`} />
          </ListItemButton>
        </List>
      </Box>
    </>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // Better performance on mobile
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
