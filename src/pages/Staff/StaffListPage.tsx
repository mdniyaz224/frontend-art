import React, { useEffect, useCallback, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControlLabel,
  Menu,
  MenuItem,
  Switch,
  TextField,
  InputAdornment,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs, { type Dayjs } from 'dayjs';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import StaffTable from '../../features/staff/components/StaffTable';
import StaffFormDrawer from '../../features/staff/components/StaffFormDrawer';
import AttendanceTable from '../../features/attendance/components/AttendanceTable';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectStaffList,
  selectStaffLoading,
  selectStaffError,
  selectStaffPagination,
  selectStaffSubmitting,
} from '../../features/staff/staffSelectors';
import { fetchStaffList, toggleStaffActiveThunk } from '../../features/staff/staffThunk';
import { usePermission } from '../../hooks/usePermission';
import { useDebounce } from '../../hooks/useDebounce';
import { PERMISSIONS, SEARCH_DEBOUNCE_MS } from '../../utils/constants';
import { staffAccentButtonSx } from '../../features/staff/staffAccent';
import { usePageTitle } from '../../contexts/PageTitleContext';
import { STAFF_ROLE_OPTIONS, type Staff } from '../../features/staff/staffTypes';
import type { StaffRole } from '../../types/common';

type Tab = 'staff' | 'attendance';

const SORT_OPTIONS: { label: string; sortBy: string; sortOrder: 'asc' | 'desc' }[] = [
  { label: 'Name (A-Z)', sortBy: 'name', sortOrder: 'asc' },
  { label: 'Salary (High to Low)', sortBy: 'salary', sortOrder: 'desc' },
  { label: 'Date of Birth', sortBy: 'dateOfBirth', sortOrder: 'asc' },
  { label: 'Newest First', sortBy: 'createdAt', sortOrder: 'desc' },
];

const StaffListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canCreate = usePermission(PERMISSIONS.STAFF_CREATE);
  usePageTitle('Staff Management');

  const list = useAppSelector(selectStaffList);
  const loading = useAppSelector(selectStaffLoading);
  const error = useAppSelector(selectStaffError);
  const pagination = useAppSelector(selectStaffPagination);
  const submitting = useAppSelector(selectStaffSubmitting);

  const [activeTab, setActiveTab] = useState<Tab>('staff');
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null);
  const [statusTarget, setStatusTarget] = useState<Staff | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<Dayjs>(dayjs());
  const [drawerState, setDrawerState] = useState<{ mode: 'create' | 'edit'; staff: Staff | null } | null>(
    null,
  );
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<StaffRole | ''>('');
  const [includeInactive, setIncludeInactive] = useState(false);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);

  const loadData = useCallback(
    (page = pagination.page) => {
      dispatch(
        fetchStaffList({
          page,
          pageSize: pagination.pageSize,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          search: debouncedSearch || undefined,
          role: roleFilter || undefined,
          includeInactive,
        }),
      );
    },
    [dispatch, pagination.page, pagination.pageSize, sort, debouncedSearch, roleFilter, includeInactive],
  );

  useEffect(() => {
    loadData(1);
  }, [debouncedSearch, roleFilter, includeInactive, sort]);

  const handlePageChange = useCallback((page: number) => loadData(page), [loadData]);

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      dispatch(
        fetchStaffList({
          page: 1,
          pageSize,
          sortBy: sort.sortBy,
          sortOrder: sort.sortOrder,
          search: debouncedSearch || undefined,
          role: roleFilter || undefined,
          includeInactive,
        }),
      );
    },
    [dispatch, sort, debouncedSearch, roleFilter, includeInactive],
  );

  const handleView = useCallback((staff: Staff) => navigate(`/staff/${staff.id}`), [navigate]);

  const handleEdit = useCallback((staff: Staff) => {
    setDrawerState({ mode: 'edit', staff });
  }, []);

  const handleToggleActive = useCallback((staff: Staff) => {
    setStatusTarget(staff);
  }, []);

  const confirmToggleActive = useCallback(async () => {
    if (!statusTarget) return;
    const result = await dispatch(
      toggleStaffActiveThunk({ id: statusTarget.id, isActive: statusTarget.isActive }),
    );
    if (toggleStaffActiveThunk.fulfilled.match(result)) {
      setStatusTarget(null);
      loadData();
    }
  }, [statusTarget, dispatch, loadData]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Staff ({pagination.totalItems})
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {canCreate && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setDrawerState({ mode: 'create', staff: null })}
              sx={staffAccentButtonSx}
            >
              Add Staff
            </Button>
          )}
          <Button
            variant="outlined"
            color="inherit"
            endIcon={<ArrowDropDownRoundedIcon />}
            onClick={(event) => setSortMenuAnchor(event.currentTarget)}
          >
            Sort by
          </Button>
        </Box>
      </Box>

      <Menu anchorEl={sortMenuAnchor} open={!!sortMenuAnchor} onClose={() => setSortMenuAnchor(null)}>
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.label}
            selected={option.label === sort.label}
            onClick={() => {
              setSort(option);
              setSortMenuAnchor(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      <ButtonGroup sx={{ mb: 3 }}>
        <Button
          onClick={() => setActiveTab('staff')}
          sx={activeTab === 'staff' ? staffAccentButtonSx : { color: 'text.secondary' }}
        >
          Staff Management
        </Button>
        <Button
          onClick={() => setActiveTab('attendance')}
          sx={activeTab === 'attendance' ? staffAccentButtonSx : { color: 'text.secondary' }}
        >
          Attendance
        </Button>
      </ButtonGroup>

      {activeTab === 'staff' && (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>
          <TextField
            size="small"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260, flex: '1 1 260px' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            size="small"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as StaffRole | '')}
            sx={{ minWidth: 160 }}
            slotProps={{ select: { displayEmpty: true } }}
          >
            <MenuItem value="">All roles</MenuItem>
            {STAFF_ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <FormControlLabel
            control={
              <Switch
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
            }
            label="Show inactive"
          />
        </Box>
      )}

      {activeTab === 'staff' ? (
        <StaffTable
          data={list}
          loading={loading}
          error={error}
          pagination={pagination}
          sortBy={sort.sortBy}
          sortOrder={sort.sortOrder}
          onSort={(field) =>
            setSort((prev) => ({
              label: 'Custom',
              sortBy: field,
              sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            }))
          }
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onView={handleView}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          onRetry={loadData}
        />
      ) : (
        <>
          <Box sx={{ mb: 3, maxWidth: 220 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MuiDatePicker
                label="Date"
                value={attendanceDate}
                onChange={(value) => value && setAttendanceDate(value)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
          <AttendanceTable
            data={list}
            loading={loading}
            error={error}
            pagination={pagination}
            date={attendanceDate.format('YYYY-MM-DD')}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onRetry={loadData}
          />
        </>
      )}

      <ConfirmDialog
        open={!!statusTarget}
        title={statusTarget?.isActive ? 'Deactivate Staff Member' : 'Activate Staff Member'}
        message={
          statusTarget?.isActive
            ? `Are you sure you want to deactivate "${statusTarget?.name}"? They will no longer be able to sign in.`
            : `Are you sure you want to reactivate "${statusTarget?.name}"?`
        }
        confirmLabel={statusTarget?.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={statusTarget?.isActive ? 'error' : 'success'}
        loading={submitting}
        onConfirm={confirmToggleActive}
        onCancel={() => setStatusTarget(null)}
      />

      <StaffFormDrawer
        open={!!drawerState}
        mode={drawerState?.mode || 'create'}
        staff={drawerState?.staff}
        onClose={() => setDrawerState(null)}
        onSuccess={loadData}
      />
    </Box>
  );
};

export default StaffListPage;
