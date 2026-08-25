// ============================================================
// Users Page — Stub
// ============================================================

import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

const UsersPage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage system users and their access"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Users' },
        ]}
      />
      <Card>
        <CardContent>
          <EmptyState
            message="Users Module"
            description="This module follows the Aircraft reference implementation. Add user management logic following the same feature-based pattern."
            icon={<PeopleRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default UsersPage;
