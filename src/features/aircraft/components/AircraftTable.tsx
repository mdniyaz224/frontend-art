// ============================================================
// AircraftTable — Business-specific Table Configuration
// ============================================================

import React, { useCallback } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DataTable from '../../../components/common/DataTable/DataTable';
import StatusChip from '../../../components/common/StatusChip/StatusChip';
import type { DataTableColumn, DataTableAction } from '../../../types/common';
import type { PaginationMeta } from '../../../types/api';
import type { Aircraft } from '../aircraftTypes';
import { AIRCRAFT_STATUS_OPTIONS } from '../aircraftTypes';
import { formatDate, formatNumber } from '../../../utils/formatters';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/constants';

interface AircraftTableProps {
  data: Aircraft[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onView: (aircraft: Aircraft) => void;
  onEdit: (aircraft: Aircraft) => void;
  onDelete: (aircraft: Aircraft) => void;
  onRetry: () => void;
}

const AircraftTable: React.FC<AircraftTableProps> = ({
  data,
  loading,
  error,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onPageSizeChange,
  onView,
  onEdit,
  onDelete,
  onRetry,
}) => {
  const canEdit = usePermission(PERMISSIONS.AIRCRAFT_EDIT);
  const canDelete = usePermission(PERMISSIONS.AIRCRAFT_DELETE);

  const columns: DataTableColumn<Aircraft>[] = [
    {
      id: 'registrationNumber',
      label: 'Reg. Number',
      accessor: 'registrationNumber',
      sortable: true,
      minWidth: 130,
    },
    {
      id: 'model',
      label: 'Model',
      accessor: 'model',
      sortable: true,
      minWidth: 120,
    },
    {
      id: 'manufacturer',
      label: 'Manufacturer',
      accessor: 'manufacturer',
      sortable: true,
      minWidth: 140,
    },
    {
      id: 'status',
      label: 'Status',
      accessor: 'status',
      sortable: true,
      minWidth: 140,
      render: (value) => {
        const statusOption = AIRCRAFT_STATUS_OPTIONS.find((s) => s.value === value);
        return (
          <StatusChip
            label={statusOption?.label || String(value)}
            color={statusOption?.color || 'default'}
          />
        );
      },
    },
    {
      id: 'totalFlightHours',
      label: 'Flight Hours',
      accessor: 'totalFlightHours',
      sortable: true,
      align: 'right',
      minWidth: 120,
      render: (value) => formatNumber(value as number),
    },
    {
      id: 'nextMaintenanceDate',
      label: 'Next Maintenance',
      accessor: 'nextMaintenanceDate',
      sortable: true,
      minWidth: 150,
      render: (value) => formatDate(value as string | null),
    },
  ];

  const getActions = useCallback((): DataTableAction<Aircraft>[] => {
    const actions: DataTableAction<Aircraft>[] = [
      {
        id: 'view',
        label: 'View Details',
        icon: <VisibilityRoundedIcon fontSize="small" />,
        onClick: onView,
        color: 'info',
      },
    ];

    if (canEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit',
        icon: <EditRoundedIcon fontSize="small" />,
        onClick: onEdit,
        color: 'primary',
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
  }, [canEdit, canDelete, onView, onEdit, onDelete]);

  return (
    <DataTable<Aircraft>
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
      emptyMessage="No aircraft found"
    />
  );
};

export default React.memo(AircraftTable);
