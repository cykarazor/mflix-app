import { useEffect, useState, useCallback } from 'react'; // ✅ Add useCallback
import {
  Typography,
  Box,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useUser } from '../../UserContext';
import { API_BASE_URL } from '../../utils/api';
import { format } from 'date-fns';
import UserDetailModal from '../components/UserDetailModal';
import UserFilters from '../components/UserFilters';
import AnalyticsModal from '../components/AnalyticsModal';
import CustomPagination from '../components/CustomPagination';



const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useUser();
  const [pageSize, setPageSize] = useState(() => {
  return Number(localStorage.getItem('adminUsersPageSize')) || 10;
  });
  const [page, setPage] = useState(0);


  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Apply filters every time users or filter state changes
useEffect(() => {
  let filtered = users || [];

  const lowerSearch = search.trim().toLowerCase();
    if (lowerSearch) {
      filtered = filtered.filter(
      (u) =>
        (u.name?.toLowerCase() || '').includes(lowerSearch) ||
        (u.email?.toLowerCase() || '').includes(lowerSearch)
    );
    }

    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (showActiveOnly) {
      filtered = filtered.filter((u) => u.isActive);
    }

    setFilteredUsers(filtered);
  }, [users, search, roleFilter, showActiveOnly]);

  // ✅ Wrap fetchUsers in useCallback so it can safely go in useEffect deps
  const fetchUsers = useCallback(async () => {
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
  }, [user.token]); // ✅ Dependency on user.token only

  // ✅ Add fetchUsers to useEffect dependencies to fix ESLint warning
  useEffect(() => {
    if (user?.token) {
      fetchUsers();
    }
  }, [user?.token, fetchUsers]);

  const handleRowClick = (params) => {
    setSelectedUser(params.row);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === updatedUser._id
          ? {
              ...updatedUser,
              createdAtFormatted: updatedUser.createdAt
                ? format(new Date(updatedUser.createdAt), 'yyyy-MM-dd')
                : 'N/A',
              lastLoginFormatted: updatedUser.lastLogin
                ? format(new Date(updatedUser.lastLogin), 'yyyy-MM-dd HH:mm')
                : 'Never',
            }
          : u
      )
    );
  };

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
        <Typography color="error">
          ⚠️ Failed to load users. Please try again later.
        </Typography>
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

      <Box display="flex" flexDirection="column" flex={1} minHeight="0">
        <UserFilters
          search={search}
          onSearchChange={setSearch}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          showActiveOnly={showActiveOnly}
          onActiveToggle={setShowActiveOnly}
        />
        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
          <Typography variant="h6">User Table</Typography>
          <Button variant="contained" color="primary" onClick={() => setShowAnalytics(true)}>
            View Analytics
          </Button>
        </Box>
        <>
        <DataGrid
          rows={(filteredUsers || []).slice(page * pageSize, (page + 1) * pageSize)}
          columns={columns}
          getRowId={(row) => row._id}
          pagination
          paginationModel={{ pageSize, page }}
          onPaginationModelChange={(model) => {
            setPageSize(model.pageSize);
            setPage(model.page);
            localStorage.setItem('adminUsersPageSize', model.pageSize);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          paginationMode="client" // default but explicit is better
          hideFooterPagination
          sx={{ cursor: 'pointer' }}
        />
        <CustomPagination
        page={page}
        rowCount={totalUserCount}
        pageSize={pageSize}
        onPageChange={setPage}
      />
      </>
      </Box>

      {/* ✅ Token is passed as prop inside `user` object */}
      {selectedUser && (
        <UserDetailModal
          open={isModalOpen}
          onClose={handleModalClose}
          user={selectedUser}
          token={user.token}
          onUserUpdated={handleUserUpdated}
        />
      )}
      <AnalyticsModal
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        users={filteredUsers}
      />
    </Box>
  );
};

export default AdminUsersPage;
