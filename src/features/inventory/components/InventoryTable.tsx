// ============================================================
// InventoryTable — Business-specific Table Configuration
// ============================================================

import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import DataTable from '../../../components/common/DataTable/DataTable';
import StatusChip from '../../../components/common/StatusChip/StatusChip';
import InventoryNameCell from './InventoryNameCell';
import type { DataTableColumn, DataTableAction } from '../../../types/common';
import type { PaginationMeta } from '../../../types/api';
import type { Product } from '../inventoryTypes';
import { PRODUCT_STATUS_OPTIONS } from '../inventoryTypes';
import { formatCurrency } from '../../../utils/formatters';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/constants';

interface InventoryTableProps {
  data: Product[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onViewHistory: (product: Product) => void;
  onRetry: () => void;
}

const STATUS_COLOR: Record<Product['status'], 'success' | 'default' | 'warning'> = {
  active: 'success',
  inactive: 'default',
  draft: 'warning',
};

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  loading,
  error,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onViewHistory,
  onRetry,
}) => {
  const canEdit = usePermission(PERMISSIONS.INVENTORY_EDIT);
  const canDelete = usePermission(PERMISSIONS.INVENTORY_DELETE);
  // Matches be-boiler's GET /:id/adjustments RBAC (ADMIN, MANAGER only).
  const canViewHistory = usePermission(PERMISSIONS.INVENTORY_ADJUST_STOCK);

  const columns: DataTableColumn<Product>[] = [
    {
      id: 'name',
      label: 'Product',
      accessor: (row) => <InventoryNameCell product={row} />,
      sortable: true,
      minWidth: 240,
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      minWidth: 110,
      render: (value) => {
        const option = PRODUCT_STATUS_OPTIONS.find((o) => o.value === value);
        return (
          <StatusChip
            label={option?.label || String(value)}
            color={STATUS_COLOR[value as Product['status']] || 'default'}
          />
        );
      },
    },
    {
      id: 'category',
      label: 'Category',
      accessor: 'category',
      sortable: true,
      minWidth: 140,
    },
    {
      id: 'quantity',
      label: 'Stock',
      accessor: 'quantity',
      sortable: true,
      minWidth: 160,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">{value as number}</Typography>
          {!row.isInStock ? (
            <StatusChip label="Out of Stock" color="error" />
          ) : row.isLowStock ? (
            <StatusChip label="Low Stock" color="warning" />
          ) : null}
        </Box>
      ),
    },
    {
      id: 'price',
      label: 'Retail Price',
      accessor: 'price',
      sortable: true,
      align: 'right',
      minWidth: 110,
      render: (value) => formatCurrency(value as number),
    },
  ];

  const getActions = useCallback((): DataTableAction<Product>[] => {
    const actions: DataTableAction<Product>[] = [];

    if (canEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit',
        icon: <EditRoundedIcon fontSize="small" />,
        onClick: onEdit,
        color: 'inherit',
      });
    }

    if (canViewHistory) {
      actions.push({
        id: 'history',
        label: 'Stock History',
        icon: <HistoryRoundedIcon fontSize="small" />,
        onClick: onViewHistory,
        color: 'inherit',
      });
    }

    if (canDelete) {
      actions.push({
        id: 'delete',
        label: 'Delete',
        icon: <DeleteRoundedIcon fontSize="small" />,
        onClick: onDelete,
        color: 'error',
      });
    }

    return actions;
  }, [canEdit, canDelete, canViewHistory, onEdit, onDelete, onViewHistory]);

  return (
    <DataTable<Product>
      columns={columns}
      rows={data}
      loading={loading}
      error={error}
      actions={getActions()}
      pagination={pagination}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No products found"
    />
  );
};

export default React.memo(InventoryTable);
