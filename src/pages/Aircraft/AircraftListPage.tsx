// ============================================================
// Aircraft List Page
// ============================================================

import React, { useEffect, useCallback, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PageHeader from '../../components/common/PageHeader/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog/ConfirmDialog';
import AircraftTable from '../../features/aircraft/components/AircraftTable';
import AircraftFilters from '../../features/aircraft/components/AircraftFilters';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import {
  selectAircraftList,
  selectAircraftLoading,
  selectAircraftError,
  selectAircraftPagination,
  selectAircraftFilters,
  selectAircraftSubmitting,
} from '../../features/aircraft/aircraftSelectors';
import { fetchAircraftList, deleteAircraftThunk } from '../../features/aircraft/aircraftThunk';
import { setAircraftFilters } from '../../features/aircraft/aircraftSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { usePermission } from '../../hooks/usePermission';
import { PERMISSIONS } from '../../utils/constants';
import type { Aircraft, AircraftFilter } from '../../features/aircraft/aircraftTypes';

const AircraftListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canCreate = usePermission(PERMISSIONS.AIRCRAFT_CREATE);

  const list = useAppSelector(selectAircraftList);
  const loading = useAppSelector(selectAircraftLoading);
  const error = useAppSelector(selectAircraftError);
  const pagination = useAppSelector(selectAircraftPagination);
  const filters = useAppSelector(selectAircraftFilters);
  const submitting = useAppSelector(selectAircraftSubmitting);

  const [sortBy, setSortBy] = useState<string>('registrationNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [deleteTarget, setDeleteTarget] = useState<Aircraft | null>(null);

  const debouncedSearch = useDebounce(filters.search || '', 400);

  const loadData = useCallback(() => {
    dispatch(
      fetchAircraftList({
        page: pagination.page,
        pageSize: pagination.pageSize,
        sortBy,
        sortOrder,
        search: debouncedSearch,
        status: filters.status || undefined,
      }),
    );
  }, [dispatch, pagination.page, pagination.pageSize, sortBy, sortOrder, debouncedSearch, filters.status]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSort = useCallback(
    (field: string) => {
      if (field === sortBy) {
        setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortOrder('asc');
      }
    },
    [sortBy],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(
        fetchAircraftList({
          page,
          pageSize: pagination.pageSize,
          sortBy,
          sortOrder,
          search: debouncedSearch,
          status: filters.status || undefined,
        }),
      );
    },
    [dispatch, pagination.pageSize, sortBy, sortOrder, debouncedSearch, filters.status],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      dispatch(
        fetchAircraftList({
          page: 1,
          pageSize,
          sortBy,
          sortOrder,
          search: debouncedSearch,
          status: filters.status || undefined,
        }),
      );
    },
    [dispatch, sortBy, sortOrder, debouncedSearch, filters.status],
  );

  const handleFiltersChange = useCallback(
    (newFilters: AircraftFilter) => {
      dispatch(setAircraftFilters(newFilters));
    },
    [dispatch],
  );

  const handleView = useCallback(
    (aircraft: Aircraft) => navigate(`/aircraft/${aircraft.id}`),
    [navigate],
  );

  const handleEdit = useCallback(
    (aircraft: Aircraft) => navigate(`/aircraft/${aircraft.id}/edit`),
    [navigate],
  );

  const handleDelete = useCallback((aircraft: Aircraft) => {
    setDeleteTarget(aircraft);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    const result = await dispatch(deleteAircraftThunk(deleteTarget.id));
    if (deleteAircraftThunk.fulfilled.match(result)) {
      setDeleteTarget(null);
      loadData();
    }
  }, [deleteTarget, dispatch, loadData]);

  return (
    <Box>
      <PageHeader
        title="Aircraft"
        subtitle="Manage your fleet of aircraft"
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Aircraft' },
        ]}
        actions={
          canCreate
            ? [
              {
                label: 'Add Aircraft',
                onClick: () => navigate('/aircraft/new'),
                icon: <AddRoundedIcon />,
              },
            ]
            : []
        }
      />

      <AircraftFilters filters={filters} onChange={handleFiltersChange} />

      <AircraftTable
        data={list}
        loading={loading}
        error={error}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRetry={loadData}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Aircraft"
        message={`Are you sure you want to delete aircraft "${deleteTarget?.registrationNumber}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
        loading={submitting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
};

export default AircraftListPage;
