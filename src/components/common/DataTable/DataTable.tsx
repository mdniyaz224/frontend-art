// ============================================================
// DataTable — Generic Reusable Enterprise Data Table
// ============================================================

import React, { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  IconButton,
  Tooltip,
  Box,
  Skeleton,
  Typography,
  alpha,
} from '@mui/material';
import type { DataTableColumn, DataTableAction } from '../../../types/common';
import type { PaginationMeta } from '../../../types/api';
import { PAGE_SIZE_OPTIONS } from '../../../utils/constants';
import EmptyState from '../EmptyState/EmptyState';
import ErrorState from '../ErrorState/ErrorState';

interface DataTableProps<T extends { id: string }> {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  actions?: DataTableAction<T>[];
  pagination?: PaginationMeta;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRetry?: () => void;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  stickyHeader?: boolean;
  maxHeight?: number | string;
}

function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading = false,
  error = null,
  actions,
  pagination,
  sortBy,
  sortOrder = 'asc',
  onSort,
  onPageChange,
  onPageSizeChange,
  onRetry,
  emptyMessage = 'No data found',
  emptyIcon,
  stickyHeader = false,
  maxHeight,
}: DataTableProps<T>) {
  const handleSort = useCallback(
    (field: string) => {
      if (onSort) onSort(field);
    },
    [onSort],
  );

  const handlePageChange = useCallback(
    (_: unknown, newPage: number) => {
      if (onPageChange) onPageChange(newPage + 1); // MUI is 0-indexed, API is 1-indexed
    },
    [onPageChange],
  );

  const handleRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onPageSizeChange) onPageSizeChange(parseInt(event.target.value, 10));
    },
    [onPageSizeChange],
  );

  const getCellValue = (column: DataTableColumn<T>, row: T): React.ReactNode => {
    if (column.render) {
      const rawValue = typeof column.accessor === 'function'
        ? column.accessor(row)
        : row[column.accessor];
      return column.render(rawValue, row);
    }
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    const value = row[column.accessor];
    if (value === null || value === undefined) return '—';
    return String(value);
  };

  // Error state
  if (error && !loading) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // Loading skeleton
  if (loading && rows.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton width={100} />
                  </TableCell>
                ))}
                {actions && <TableCell><Skeleton width={60} /></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton />
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell>
                      <Skeleton width={60} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  // Empty state
  if (!loading && rows.length === 0) {
    return <EmptyState message={emptyMessage} icon={emptyIcon} />;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: maxHeight }}>
        <Table stickyHeader={stickyHeader} size="medium">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    bgcolor: 'background.paper',
                  }}
                >
                  {column.sortable && onSort ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              {actions && actions.length > 0 && (
                <TableCell align="right" sx={{ bgcolor: 'background.paper', minWidth: 120 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  opacity: loading ? 0.5 : 1,
                  transition: 'opacity 0.2s, background-color 0.2s',
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align || 'left'}>
                    {getCellValue(column, row)}
                  </TableCell>
                ))}
                {actions && actions.length > 0 && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                      {actions
                        .filter((action) => !action.show || action.show(row))
                        .map((action) => (
                          <Tooltip key={action.id} title={action.label}>
                            <span>
                              <IconButton
                                size="small"
                                color={action.color || 'inherit'}
                                onClick={() => action.onClick(row)}
                                disabled={action.disabled ? action.disabled(row) : false}
                                sx={{
                                  bgcolor: (theme) =>
                                    action.color && action.color !== 'inherit'
                                      ? alpha(theme.palette[action.color].main, 0.16)
                                      : alpha(theme.palette.text.primary, 0.08),
                                  '&:hover': {
                                    bgcolor: (theme) =>
                                      action.color && action.color !== 'inherit'
                                        ? alpha(theme.palette[action.color].main, 0.28)
                                        : alpha(theme.palette.text.primary, 0.16),
                                  },
                                }}
                              >
                                {action.icon}
                              </IconButton>
                            </span>
                          </Tooltip>
                        ))}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.totalItems}
          page={pagination.page - 1} // MUI is 0-indexed
          rowsPerPage={pagination.pageSize}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
        />
      )}
    </Paper>
  );
}

export default React.memo(DataTable) as typeof DataTable;
