// ============================================================
// Aircraft Detail Page
// ============================================================

import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import ErrorState from '../../components/common/ErrorState/ErrorState';
import StatusChip from '../../components/common/StatusChip/StatusChip';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectSelectedAircraft,
  selectAircraftDetailLoading,
  selectAircraftError,
} from '../../features/aircraft/aircraftSelectors';
import { fetchAircraftById } from '../../features/aircraft/aircraftThunk';
import { clearSelectedAircraft } from '../../features/aircraft/aircraftSlice';
import { AIRCRAFT_STATUS_OPTIONS } from '../../features/aircraft/aircraftTypes';
import { formatDate, formatNumber } from '../../utils/formatters';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../utils/constants';

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box sx={{ py: 1.5 }}>
    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mt: 0.25, fontWeight: 500 }}>
      {value || '—'}
    </Typography>
  </Box>
);

const AircraftDetailPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const canEdit = usePermission(PERMISSIONS.AIRCRAFT_EDIT);

  const aircraft = useAppSelector(selectSelectedAircraft);
  const loading = useAppSelector(selectAircraftDetailLoading);
  const error = useAppSelector(selectAircraftError);

  useEffect(() => {
    if (id) dispatch(fetchAircraftById(id));
    return () => {
      dispatch(clearSelectedAircraft());
    };
  }, [dispatch, id]);

  if (loading) return <LoadingOverlay message="Loading aircraft..." />;
  if (error && !aircraft) return <ErrorState message={error} onRetry={() => id && dispatch(fetchAircraftById(id))} />;
  if (!aircraft) return <ErrorState message="Aircraft not found" />;

  const statusOption = AIRCRAFT_STATUS_OPTIONS.find((s) => s.value === aircraft.status);

  return (
    <Box>
      <PageHeader
        title={aircraft.registrationNumber}
        subtitle={`${aircraft.manufacturer} ${aircraft.model}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Aircraft', path: '/aircraft' },
          { label: aircraft.registrationNumber },
        ]}
        actions={
          canEdit
            ? [
              {
                label: 'Edit',
                onClick: () => navigate(`/aircraft/${aircraft.id}/edit`),
                icon: <EditRoundedIcon />,
                variant: 'outlined',
              },
            ]
            : []
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Aircraft Information
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Registration Number" value={aircraft.registrationNumber} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Serial Number" value={aircraft.serialNumber} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Model" value={aircraft.model} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Manufacturer" value={aircraft.manufacturer} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Engine Type" value={aircraft.engineType} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Year of Manufacture" value={String(aircraft.yearOfManufacture)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow label="Capacity" value={`${aircraft.capacity} passengers`} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DetailRow
                    label="Status"
                    value={
                      <StatusChip
                        label={statusOption?.label || aircraft.status}
                        color={statusOption?.color || 'default'}
                      />
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Flight & Maintenance
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <DetailRow label="Total Flight Hours" value={formatNumber(aircraft.totalFlightHours)} />
              <DetailRow label="Last Maintenance" value={formatDate(aircraft.lastMaintenanceDate)} />
              <DetailRow label="Next Maintenance" value={formatDate(aircraft.nextMaintenanceDate)} />
            </CardContent>
          </Card>

          {aircraft.notes && (
            <Card sx={{ mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Notes
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {aircraft.notes}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AircraftDetailPage;
