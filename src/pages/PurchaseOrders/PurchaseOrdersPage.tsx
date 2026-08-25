// ============================================================
// Purchase Orders Page — Stub
// ============================================================

import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import EmptyState from '../../components/common/EmptyState/EmptyState';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';

const PurchaseOrdersPage: React.FC = () => {
  return (
    <Box>
      <PageHeader
        title="Purchase Orders"
        subtitle="Manage procurement and purchase orders"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Purchase Orders' },
        ]}
      />
      <Card>
        <CardContent>
          <EmptyState
            message="Purchase Orders Module"
            description="This module follows the Aircraft reference implementation. Add purchase order management logic following the same feature-based pattern."
            icon={<ShoppingCartRoundedIcon sx={{ fontSize: 32, color: 'text.secondary' }} />}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default PurchaseOrdersPage;
