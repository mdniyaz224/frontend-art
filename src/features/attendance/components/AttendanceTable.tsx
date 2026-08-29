// ============================================================
// AttendanceTable — Attendance View Over the Staff List
// ============================================================
// There's no separate "attendance list" endpoint spanning staff — this
// re-renders the same staff rows already loaded for the Staff tab with a
// Date/Status column swapped in for Email/Phone/Salary.

import React from 'react';
import DataTable from '../../../components/common/DataTable/DataTable';
import StaffNameCell from '../../staff/components/StaffNameCell';
import AttendanceStatusCell from './AttendanceStatusCell';
import type { DataTableColumn } from '../../../types/common';
import type { PaginationMeta } from '../../../types/api';
import type { Staff } from '../../staff/staffTypes';
import { formatShiftRange, formatDate, shortId } from '../../../utils/formatters';

interface AttendanceTableProps {
  data: Staff[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  date: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
  data,
  loading,
  error,
  pagination,
  date,
  onPageChange,
  onPageSizeChange,
  onRetry,
}) => {
  const columns: DataTableColumn<Staff>[] = [
    {
      id: 'id',
      label: 'ID',
      accessor: (row) => shortId(row.id),
      minWidth: 80,
    },
    {
      id: 'name',
      label: 'Name',
      accessor: (row) => <StaffNameCell staff={row} />,
      minWidth: 200,
    },
    {
      id: 'date',
      label: 'Date',
      accessor: () => formatDate(date, 'DD-MMM-YYYY'),
      minWidth: 120,
    },
    {
      id: 'timings',
      label: 'Timings',
      accessor: (row) => formatShiftRange(row.shiftStart, row.shiftEnd),
      minWidth: 120,
    },
    {
      id: 'status',
      label: 'Status',
      accessor: (row) => <AttendanceStatusCell staffId={row.id} date={date} />,
      minWidth: 260,
    },
  ];

  return (
    <DataTable<Staff>
      columns={columns}
      rows={data}
      loading={loading}
      error={error}
      pagination={pagination}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRetry={onRetry}
      emptyMessage="No staff members found"
    />
  );
};

export default React.memo(AttendanceTable);
