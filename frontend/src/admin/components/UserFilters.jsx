import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from '@mui/material';

const UserFilters = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  showActiveOnly,
  onActiveToggle,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <TextField
        label="Search by name or email"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
        sx={{ minWidth: 250 }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="role-filter-label">Role</InputLabel>
        <Select
          labelId="role-filter-label"
          label="Role"
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="user">User</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Switch
            checked={showActiveOnly}
            onChange={(e) => onActiveToggle(e.target.checked)}
            color="primary"
          />
        }
        label="Active Only"
      />
    </Box>
  );
};

export default UserFilters;
