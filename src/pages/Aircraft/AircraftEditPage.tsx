// ============================================================
// Aircraft Edit Page
// ============================================================

import React, { useEffect, useCallback } from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import LoadingOverlay from '../../components/common/LoadingOverlay/LoadingOverlay';
import ErrorState from '../../components/common/ErrorState/ErrorState';
import AircraftForm from '../../features/aircraft/components/AircraftForm';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectSelectedAircraft,
  selectAircraftDetailLoading,
  selectAircraftSubmitting,
  selectAircraftError,
} from '../../features/aircraft/aircraftSelectors';
import { fetchAircraftById, updateAircraftThunk } from '../../features/aircraft/aircraftThunk';
import { clearSelectedAircraft } from '../../features/aircraft/aircraftSlice';
import type { AircraftFormValues } from '../../features/aircraft/aircraftTypes';

const AircraftEditPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const aircraft = useAppSelector(selectSelectedAircraft);
  const detailLoading = useAppSelector(selectAircraftDetailLoading);
  const submitting = useAppSelector(selectAircraftSubmitting);
  const error = useAppSelector(selectAircraftError);

  useEffect(() => {
    if (id) {
      dispatch(fetchAircraftById(id));
    }
    return () => {
      dispatch(clearSelectedAircraft());
    };
  }, [dispatch, id]);

  const handleSubmit = useCallback(
    async (data: AircraftFormValues) => {
      if (!id) return;
      const result = await dispatch(updateAircraftThunk({ id, data }));
      if (updateAircraftThunk.fulfilled.match(result)) {
        navigate('/aircraft');
      }
    },
    [dispatch, navigate, id],
  );

  if (detailLoading) {
    return <LoadingOverlay message="Loading aircraft details..." />;
  }

  if (error && !aircraft) {
    return <ErrorState message={error} onRetry={() => id && dispatch(fetchAircraftById(id))} />;
  }

  return (
    <Box>
      <PageHeader
        title="Edit Aircraft"
        subtitle={`Editing ${aircraft?.registrationNumber || ''}`}
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Aircraft', path: '/aircraft' },
          { label: 'Edit' },
        ]}
      />
      <Card>
        <CardContent sx={{ p: 3 }}>
          {aircraft && (
            <AircraftForm
              defaultValues={aircraft}
              onSubmit={handleSubmit}
              loading={submitting}
              submitLabel="Update Aircraft"
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AircraftEditPage;
