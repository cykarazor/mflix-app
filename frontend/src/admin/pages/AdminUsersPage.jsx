// frontend/src/admin/pages/AdminUsersPage.jsx
import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box } from '@mui/material';
import { useUser } from '../../UserContext';
import { API_BASE_URL } from '../../utils/api';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, [user.token]);

  const columns = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 100,
      valueGetter: (params) => (params.row.isActive ? 'Active' : 'Inactive'),
    },
    {
      field: 'createdAt',
      headerName: 'Joined',
      width: 180,
      valueGetter: (params) => new Date(params.row.createdAt).toLocaleString(),
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>All Users</Typography>
      <Box height={500} mt={2}>
        <DataGrid
          rows={users}
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
