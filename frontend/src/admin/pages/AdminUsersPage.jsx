import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, CircularProgress } from '@mui/material';
import { useUser } from '../../UserContext';
import { API_BASE_URL } from '../../utils/api';
import { format } from 'date-fns';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
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

  const columns = [
  { field: '_id', headerName: 'User ID', flex: 2, minWidth: 220 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'role', headerName: 'Role', flex: 1 },
  {
    field: 'isActive',
    headerName: 'Active',
    flex: 0.7,
    renderCell: (params) => (params.row?.isActive ? 'Yes' : 'No'),
  },
  {
    field: 'createdAt',
    headerName: 'Joined',
    flex: 1.2,
    valueGetter: (params) =>
      params.row?.createdAt
        ? format(new Date(params.row.createdAt), 'yyyy-MM-dd')
        : 'N/A',
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    flex: 1.2,
    valueGetter: (params) => {
      const date = params.row?.lastLogin;
      if (!date) return 'Never';
      try {
        return format(new Date(date), 'yyyy-MM-dd HH:mm');
      } catch (e) {
        return 'Invalid';
      }
    },
  },
];


  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All Users
      </Typography>
      <Box height={500} mt={2}>
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
