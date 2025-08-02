// src/admin/components/Sidebar.jsx
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
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

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose(); // Close drawer on mobile after selection
    }
  };

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton onClick={() => handleMenuClick('/admin')}>
          <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/users?role=admin')}>
          <ListItemIcon><AdminPanelSettingsIcon /></ListItemIcon>
          <ListItemText primary="Admins" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/users?role=user')}>
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/movies')}>
          <ListItemIcon><MovieIcon /></ListItemIcon>
          <ListItemText primary="Movies" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/comments')}>
          <ListItemIcon><CommentIcon /></ListItemIcon>
          <ListItemText primary="Comments" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/likes')}>
          <ListItemIcon><ThumbUpIcon color="success" /></ListItemIcon>
          <ListItemText primary="Likes" />
        </ListItemButton>
        <ListItemButton onClick={() => handleMenuClick('/admin/dislikes')}>
          <ListItemIcon><ThumbDownIcon color="error" /></ListItemIcon>
          <ListItemText primary="Dislikes" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
