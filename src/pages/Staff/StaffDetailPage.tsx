import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import ErrorState from '../../components/common/ErrorState/ErrorState';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import StaffFormDrawer from '../../features/staff/components/StaffFormDrawer';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectSelectedStaff,
  selectStaffDetailLoading,
  selectStaffError,
  selectStaffSubmitting,
} from '../../features/staff/staffSelectors';
import {
  fetchStaffById,
  toggleStaffActiveThunk,
  assignStaffRoleThunk,
} from '../../features/staff/staffThunk';
import { clearSelectedStaff } from '../../features/staff/staffSlice';
import { STAFF_ROLE_OPTIONS } from '../../features/staff/staffTypes';
import type { StaffRole } from '../../types/common';
import { formatCurrency, formatDate, getInitials, capitalize } from '../../utils/formatters';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../utils/constants';
import { staffAccentButtonSx } from '../../features/staff/staffAccent';
import { usePageTitle } from '../../contexts/PageTitleContext';

const DetailField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.25, fontWeight: 500 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const StaffDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const canEdit = usePermission(PERMISSIONS.STAFF_EDIT);

  const canManageStatus = usePermission(PERMISSIONS.STAFF_DELETE);
  const canManageRole = usePermission(PERMISSIONS.STAFF_MANAGE_ROLE);

  const staff = useAppSelector(selectSelectedStaff);
  const loading = useAppSelector(selectStaffDetailLoading);
  const error = useAppSelector(selectStaffError);
  const submitting = useAppSelector(selectStaffSubmitting);

  const [confirmStatusChange, setConfirmStatusChange] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [pendingRole, setPendingRole] = useState<StaffRole | ''>('');

  usePageTitle(staff?.name ?? null, true);

  useEffect(() => {
    if (id) dispatch(fetchStaffById(id));
    return () => {
      dispatch(clearSelectedStaff());
    };
  }, [dispatch, id]);

  if (loading) return <LoadingOverlay message="Loading staff member..." />;
  if (error && !staff) return <ErrorState message={error} onRetry={() => id && dispatch(fetchStaffById(id))} />;
  if (!staff) return <ErrorState message="Staff member not found" />;

  const handleConfirmToggleActive = async () => {
    const result = await dispatch(toggleStaffActiveThunk({ id: staff.id, isActive: staff.isActive }));
    if (toggleStaffActiveThunk.fulfilled.match(result)) {
      setConfirmStatusChange(false);
    }
  };

  const handleStartEditRole = () => {
    setPendingRole(staff.role);
    setEditingRole(true);
  };

  const handleSaveRole = async () => {
    if (pendingRole && pendingRole !== staff.role) {
      await dispatch(assignStaffRoleThunk({ id: staff.id, role: pendingRole }));
    }
    setEditingRole(false);
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {}
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Profile Image
          </Typography>
          <Avatar
            variant="rounded"
            src={staff.profilePicture}
            sx={{ width: '100%', height: 260, borderRadius: 3, fontSize: '3rem', bgcolor: 'rgba(255,255,255,0.06)' }}
          >
            {getInitials(staff.name)}
          </Avatar>
          <Typography
            variant="body2"
            sx={{ mt: 1.5, mb: 3, cursor: canEdit ? 'pointer' : 'default', textDecoration: 'underline' }}
            onClick={() => canEdit && setEditOpen(true)}
          >
            Change Profile Picture
          </Typography>

          {canEdit && (
            <Button
              fullWidth
              variant="contained"
              sx={{ mb: 1.5, ...staffAccentButtonSx }}
              onClick={() => setEditOpen(true)}
            >
              Edit profile
            </Button>
          )}
          {canManageStatus && (
            <Button
              fullWidth
              variant="outlined"
              color={staff.isActive ? 'error' : 'success'}
              onClick={() => setConfirmStatusChange(true)}
            >
              {staff.isActive ? 'Delete profile' : 'Reactivate profile'}
            </Button>
          )}
        </Grid>

        {}
        <Grid item xs={12} md={8}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Employee Personal Details
          </Typography>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Full Name" value={staff.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Email" value={staff.email} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Phone number" value={staff.phone} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Date of birth" value={formatDate(staff.dateOfBirth)} />
                </Grid>
                <Grid item xs={12}>
                  <DetailField label="Address" value={staff.address} />
                </Grid>
                {staff.additionalDetails && (
                  <Grid item xs={12}>
                    <DetailField label="Additional details" value={staff.additionalDetails} />
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
            Employee Job Details
          </Typography>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      {editingRole ? (
                        <TextField
                          select
                          size="small"
                          fullWidth
                          label="Role"
                          value={pendingRole}
                          onChange={(e) => setPendingRole(e.target.value as StaffRole)}
                        >
                          {STAFF_ROLE_OPTIONS.map((r) => (
                            <MenuItem key={r.value} value={r.value}>
                              {r.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <DetailField label="Role" value={capitalize(staff.role)} />
                      )}
                    </Box>
                    {canManageRole &&
                      (editingRole ? (
                        <Button size="small" disabled={submitting} onClick={handleSaveRole}>
                          Save
                        </Button>
                      ) : (
                        <IconButton size="small" onClick={handleStartEditRole}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      ))}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Salary" value={formatCurrency(staff.salary)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Shift start timing" value={staff.shiftStart} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailField label="Shift end timing" value={staff.shiftEnd} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={confirmStatusChange}
        title={staff.isActive ? 'Deactivate Staff Member' : 'Activate Staff Member'}
        message={
          staff.isActive
            ? `Are you sure you want to deactivate "${staff.name}"? They will no longer be able to sign in.`
            : `Are you sure you want to reactivate "${staff.name}"?`
        }
        confirmLabel={staff.isActive ? 'Deactivate' : 'Activate'}
        confirmColor={staff.isActive ? 'error' : 'success'}
        loading={submitting}
        onConfirm={handleConfirmToggleActive}
        onCancel={() => setConfirmStatusChange(false)}
      />

      <StaffFormDrawer
        open={editOpen}
        mode="edit"
        staff={staff}
        onClose={() => setEditOpen(false)}
        onSuccess={() => id && dispatch(fetchStaffById(id))}
      />
    </Box>
  );
};

export default StaffDetailPage;
