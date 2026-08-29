// ============================================================
// Inventory Redux Slice
// ============================================================

import { createSlice } from '@reduxjs/toolkit';
import type { InventoryState } from './inventoryTypes';
import { DEFAULT_PAGINATION } from '../../types/api';
import {
  fetchProductList,
  fetchProductById,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
  fetchProductCategoriesThunk,
  fetchProductStatusCountsThunk,
  adjustStockThunk,
  fetchStockAdjustmentsThunk,
} from './inventoryThunk';

const initialState: InventoryState = {
  list: [],
  selectedProduct: null,
  categories: [],
  statusCounts: null,
  adjustments: [],
  adjustmentsPagination: DEFAULT_PAGINATION,
  loading: false,
  detailLoading: false,
  submitting: false,
  adjusting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryError(state) {
      state.error = null;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
      state.adjustments = [];
      state.adjustmentsPagination = DEFAULT_PAGINATION;
    },
  },
  extraReducers: (builder) => {
    // ---- Fetch List ----
    builder
      .addCase(fetchProductList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.products;
        // Backend returns {page,limit,total,totalPages} — adapt to the
        // generic PaginationMeta shape the shared DataTable expects.
        const { page, limit, total, totalPages } = action.payload.pagination;
        state.pagination = {
          page,
          pageSize: limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };
      })
      .addCase(fetchProductList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch products';
      });

    // ---- Fetch By ID ----
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch product';
      });

    // ---- Create ----
    builder
      .addCase(createProductThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(createProductThunk.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createProductThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to create product';
      });

    // ---- Update ----
    builder
      .addCase(updateProductThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(updateProductThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.selectedProduct = action.payload;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateProductThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to update product';
      });

    // ---- Delete ----
    builder
      .addCase(deleteProductThunk.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.submitting = false;
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.selectedProduct?.id === action.payload) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProductThunk.rejected, (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string) || 'Failed to delete product';
      });

    // ---- Categories ----
    builder.addCase(fetchProductCategoriesThunk.fulfilled, (state, action) => {
      state.categories = action.payload;
    });

    // ---- Status Counts ----
    builder.addCase(fetchProductStatusCountsThunk.fulfilled, (state, action) => {
      state.statusCounts = action.payload;
    });

    // ---- Adjust Stock ----
    builder
      .addCase(adjustStockThunk.pending, (state) => {
        state.adjusting = true;
        state.error = null;
      })
      .addCase(adjustStockThunk.fulfilled, (state, action) => {
        state.adjusting = false;
        state.selectedProduct = action.payload;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(adjustStockThunk.rejected, (state, action) => {
        state.adjusting = false;
        state.error = (action.payload as string) || 'Failed to adjust stock';
      });

    // ---- Fetch Stock Adjustments ----
    builder
      .addCase(fetchStockAdjustmentsThunk.fulfilled, (state, action) => {
        state.adjustments = action.payload.adjustments;
        const { page, limit, total, totalPages } = action.payload.pagination;
        state.adjustmentsPagination = {
          page,
          pageSize: limit,
          totalItems: total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };
      })
      .addCase(fetchStockAdjustmentsThunk.rejected, (state, action) => {
        state.error = (action.payload as string) || 'Failed to fetch stock adjustment history';
      });
  },
});

export const { clearInventoryError, clearSelectedProduct } = inventorySlice.actions;
export default inventorySlice.reducer;
