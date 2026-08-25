// ============================================================
// Aircraft Create Page
// ============================================================

import React, { useCallback } from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import AircraftForm from '../../features/aircraft/components/AircraftForm';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { selectAircraftSubmitting } from '../../features/aircraft/aircraftSelectors';
import { createAircraftThunk } from '../../features/aircraft/aircraftThunk';
import type { AircraftFormValues } from '../../features/aircraft/aircraftTypes';

const AircraftCreatePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submitting = useAppSelector(selectAircraftSubmitting);

  const handleSubmit = useCallback(
    async (data: AircraftFormValues) => {
      const result = await dispatch(createAircraftThunk(data));
      if (createAircraftThunk.fulfilled.match(result)) {
        navigate('/aircraft');
      }
    },
    [dispatch, navigate],
  );

  return (
    <Box>
      <PageHeader
        title="Create Aircraft"
        subtitle="Register a new aircraft in the fleet"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Aircraft', path: '/aircraft' },
          { label: 'Create' },
        ]}
      />
      <Card>
        <CardContent sx={{ p: 3 }}>
          <AircraftForm onSubmit={handleSubmit} loading={submitting} submitLabel="Create Aircraft" />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AircraftCreatePage;
