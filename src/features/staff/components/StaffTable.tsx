import React, { useCallback } from 'react';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DataTable from '../../../components/common/DataTable/DataTable';
import StaffNameCell from './StaffNameCell';
import type { DataTableColumn, DataTableAction } from '../../../types/common';
import type { PaginationMeta } from '../../../types/api';
import type { Staff } from '../staffTypes';
import { formatCurrency, formatShiftRange } from '../../../utils/formatters';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/constants';

interface StaffTableProps {
  data: Staff[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onToggleActive: (staff: Staff) => void;
  onRetry: () => void;
}

const StaffTable: React.FC<StaffTableProps> = ({
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
  onToggleActive,
  onRetry,
}) => {
  const canEdit = usePermission(PERMISSIONS.STAFF_EDIT);

  const canManageStatus = usePermission(PERMISSIONS.STAFF_DELETE);

  const columns: DataTableColumn<Staff>[] = [
    {
      id: 'name',
      label: 'Name',
      accessor: (row) => <StaffNameCell staff={row} />,
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'email',
      label: 'Email',
      accessor: 'email',
      sortable: true,
      minWidth: 200,
    },
    {
      id: 'phone',
      label: 'Phone',
      accessor: 'phone',
      minWidth: 140,
    },
    {
      id: 'age',
      label: 'Age',
      accessor: (row) => (row.age != null ? `${row.age} yr` : '—'),
      minWidth: 70,
    },
    {
      id: 'salary',
      label: 'Salary',
      accessor: 'salary',
      sortable: true,
      align: 'right',
      minWidth: 110,
      render: (value) => formatCurrency(value as number),
    },
    {
      id: 'timings',
      label: 'Timings',
      accessor: (row) => formatShiftRange(row.shiftStart, row.shiftEnd),
      minWidth: 120,
    },
  ];

  const getActions = useCallback((): DataTableAction<Staff>[] => {
    const actions: DataTableAction<Staff>[] = [
      {
        id: 'view',
        label: 'View Details',
        icon: <VisibilityRoundedIcon fontSize="small" />,
        onClick: onView,
        color: 'secondary',
      },
    ];

    if (canEdit) {
      actions.push({
        id: 'edit',
        label: 'Edit',
        icon: <EditRoundedIcon fontSize="small" />,
        onClick: onEdit,
        color: 'inherit',
      });
    }

    if (canManageStatus) {
      actions.push(
        {
          id: 'deactivate',
          label: 'Deactivate',
          icon: <BlockRoundedIcon fontSize="small" />,
          onClick: onToggleActive,
          color: 'error',
          show: (row) => row.isActive,
        },
        {
          id: 'activate',
          label: 'Activate',
          icon: <CheckCircleRoundedIcon fontSize="small" />,
          onClick: onToggleActive,
          color: 'success',
          show: (row) => !row.isActive,
        },
      );
    }

    return actions;
  }, [canEdit, canManageStatus, onView, onEdit, onToggleActive]);

  return (
    <DataTable<Staff>
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
      emptyMessage="No staff members found"
    />
  );
};

export default React.memo(StaffTable);
