// ============================================================
// StockAdjustmentHistoryDialog — Audit Trail for Stock Changes
// ============================================================
// Surfaces the immutable ledger written by POST /:id/adjustments
// (stockAdjustment.service.ts) — who changed stock, when, by how much,
// and why. Without this view the audit trail is recorded but invisible.

import React, { useCallback, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Typography } from '@mui/material';
import DataTable from '../../../components/common/DataTable/DataTable';
import StatusChip from '../../../components/common/StatusChip/StatusChip';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import {
  selectStockAdjustments,
  selectStockAdjustmentsPagination,
  selectStockAdjustmentsLoading,
  selectProductError,
} from '../inventorySelectors';
import { fetchStockAdjustmentsThunk } from '../inventoryThunk';
import { clearSelectedProduct } from '../inventorySlice';
import { formatDateTime } from '../../../utils/formatters';
import type { DataTableColumn } from '../../../types/common';
import type { Product, StockAdjustment } from '../inventoryTypes';

interface StockAdjustmentHistoryDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
}

const StockAdjustmentHistoryDialog: React.FC<StockAdjustmentHistoryDialogProps> = ({
  open,
  product,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const adjustments = useAppSelector(selectStockAdjustments);
  const pagination = useAppSelector(selectStockAdjustmentsPagination);
  const loading = useAppSelector(selectStockAdjustmentsLoading);
  const error = useAppSelector(selectProductError);

  // Fire-and-forget dispatch — the slice's own pending/fulfilled/rejected
  // cases drive `loading`/`error`, so no local state is set from this effect.
  const loadAdjustments = useCallback(
    (page = 1) => {
      if (!product) return;
      dispatch(fetchStockAdjustmentsThunk({ id: product.id, page, limit: pagination.pageSize }));
    },
    [dispatch, product, pagination.pageSize],
  );

  useEffect(() => {
    if (open && product) {
      loadAdjustments(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  const handleClose = () => {
    dispatch(clearSelectedProduct());
    onClose();
  };

  const columns: DataTableColumn<StockAdjustment>[] = [
    {
      id: 'createdAt',
      label: 'Date',
      accessor: 'createdAt',
      minWidth: 160,
      render: (value) => formatDateTime(value as string),
    },
    {
      id: 'delta',
      label: 'Change',
      accessor: 'delta',
      minWidth: 100,
      render: (value) => {
        const delta = value as number;
        return (
          <StatusChip
            label={delta > 0 ? `+${delta}` : String(delta)}
            color={delta > 0 ? 'success' : 'error'}
          />
        );
      },
    },
    {
      id: 'quantityChange',
      label: 'Before → After',
      accessor: (row) => `${row.quantityBefore} → ${row.quantityAfter}`,
      minWidth: 140,
    },
    {
      id: 'reason',
      label: 'Reason',
      accessor: 'reason',
      minWidth: 220,
    },
    {
      id: 'adjustedBy',
      label: 'Adjusted By',
      accessor: (row) => row.adjustedBy?.name || row.adjustedBy?.email || '—',
      minWidth: 160,
    },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Stock Adjustment History
        {product && (
          <Typography variant="body2" color="text.secondary">
            {product.name} ({product.sku}) — current quantity: <strong>{product.quantity}</strong>
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <DataTable<StockAdjustment>
            columns={columns}
            rows={adjustments}
            loading={loading}
            error={error}
            pagination={pagination}
            onPageChange={loadAdjustments}
            onRetry={() => loadAdjustments(pagination.page)}
            emptyMessage="No stock adjustments recorded for this product yet"
            maxHeight={400}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockAdjustmentHistoryDialog;
