import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from '../../UserContext';
import { API_BASE_URL } from '../../utils/api';
import { format } from 'date-fns';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();

        const formattedUsers = data.map((u) => ({
          ...u,
          createdAtFormatted: u.createdAt
            ? format(new Date(u.createdAt), 'yyyy-MM-dd')
            : 'N/A',
          lastLoginFormatted: u.lastLogin
            ? format(new Date(u.lastLogin), 'yyyy-MM-dd HH:mm')
            : 'Never',
        }));

        setUsers(formattedUsers);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user.token]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">⚠️ Failed to load users. Please try again later.</Typography>
      </Box>
    );
  }

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.5 },
    { field: 'role', headerName: 'Role', flex: 1 },
    {
        field: 'isActive',
        headerName: 'Active',
        flex: 0.8,
        renderCell: (params) => (
        <Chip
            label={params.row?.isActive ? 'Active' : 'Inactive'}
            color={params.row?.isActive ? 'success' : 'default'}
            size="small"
        />
        ),
    },
    {
        field: 'lastLoginFormatted',
        headerName: 'Last Login',
        flex: 1.2,
    },
    ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>

      <Box sx={{ height: 500, width: '100%' }} mt={2}>
        <DataGrid
          rows={users || []}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default AdminUsersPage;
