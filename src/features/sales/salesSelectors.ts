// ============================================================
// Sales / Dashboard Analytics Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectDashboardSummary = (state: RootState) => state.sales.summary;
export const selectSummaryLoading = (state: RootState) => state.sales.summaryLoading;
export const selectPopularByQuantity = (state: RootState) => state.sales.popularByQuantity;
export const selectPopularByRevenue = (state: RootState) => state.sales.popularByRevenue;
export const selectPopularLoading = (state: RootState) => state.sales.popularLoading;
export const selectOverviewSeries = (state: RootState) => state.sales.overview;
export const selectOverviewRange = (state: RootState) => state.sales.overviewRange;
export const selectOverviewLoading = (state: RootState) => state.sales.overviewLoading;
export const selectSalesError = (state: RootState) => state.sales.error;
