// ============================================================
// Inventory Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectProductList = (state: RootState) => state.inventory.list;
export const selectProductLoading = (state: RootState) => state.inventory.loading;
export const selectProductDetailLoading = (state: RootState) => state.inventory.detailLoading;
export const selectProductSubmitting = (state: RootState) => state.inventory.submitting;
export const selectProductAdjusting = (state: RootState) => state.inventory.adjusting;
export const selectProductError = (state: RootState) => state.inventory.error;
export const selectProductPagination = (state: RootState) => state.inventory.pagination;
export const selectSelectedProduct = (state: RootState) => state.inventory.selectedProduct;
export const selectProductCategories = (state: RootState) => state.inventory.categories;
export const selectProductStatusCounts = (state: RootState) => state.inventory.statusCounts;
export const selectStockAdjustments = (state: RootState) => state.inventory.adjustments;
export const selectStockAdjustmentsPagination = (state: RootState) =>
  state.inventory.adjustmentsPagination;
export const selectStockAdjustmentsLoading = (state: RootState) =>
  state.inventory.adjustmentsLoading;
