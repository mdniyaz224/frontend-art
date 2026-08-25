// ============================================================
// Purchase Order Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectPurchaseOrderList = (state: RootState) => state.purchaseOrders.list;
export const selectPurchaseOrderLoading = (state: RootState) => state.purchaseOrders.loading;
export const selectPurchaseOrderError = (state: RootState) => state.purchaseOrders.error;
export const selectPurchaseOrderPagination = (state: RootState) => state.purchaseOrders.pagination;
export const selectSelectedPurchaseOrder = (state: RootState) => state.purchaseOrders.selectedOrder;
