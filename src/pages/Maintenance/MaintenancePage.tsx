// ============================================================
// Maintenance Page — Stub
// ============================================================

import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';

const MaintenancePage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Maintenance"
        subtitle="Track and manage equipment maintenance schedules"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Maintenance' },
        ]}
      />
      <Card>
        <CardContent>
          <EmptyState
            message="Maintenance Module"
            description="This module follows the Staff reference implementation. Add maintenance management logic following the same feature-based pattern."
            icon={<BuildRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MaintenancePage;
