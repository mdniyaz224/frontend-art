// ============================================================
// Purchase Order Redux Slice
// ============================================================

import { createSlice } from '@reduxjs/toolkit';
import type { PurchaseOrderState } from './purchaseOrderTypes';
import { DEFAULT_PAGINATION } from '../../types/api';
import { fetchPurchaseOrderList, fetchPurchaseOrderById } from './purchaseOrderThunk';

const initialState: PurchaseOrderState = {
  list: [],
  selectedOrder: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    clearPurchaseOrderError(state) {
      state.error = null;
    },
    clearSelectedPurchaseOrder(state) {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrderList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPurchaseOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch purchase orders';
      });

    builder
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchPurchaseOrderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch purchase order';
      });
  },
});

export const { clearPurchaseOrderError, clearSelectedPurchaseOrder } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
