import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={() => onSearchChange('')}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
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
