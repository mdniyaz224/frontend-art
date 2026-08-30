import { createSlice } from '@reduxjs/toolkit';
import type { SalesState } from './salesTypes';
import { fetchDashboardSummary, fetchPopularDishes, fetchOverview } from './salesThunk';

const initialState: SalesState = {
  summary: null,
  summaryLoading: false,
  popularByQuantity: [],
  popularByRevenue: [],
  popularLoading: false,
  overview: [],
  overviewRange: 'monthly',
  overviewLoading: false,
  error: null,
};

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearSalesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.summaryLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch dashboard summary';
      });

    builder
      .addCase(fetchPopularDishes.pending, (state) => {
        state.popularLoading = true;
        state.error = null;
      })
      .addCase(fetchPopularDishes.fulfilled, (state, action) => {
        state.popularLoading = false;
        if (action.meta.arg.sortBy === 'revenue') {
          state.popularByRevenue = action.payload;
        } else {
          state.popularByQuantity = action.payload;
        }
      })
      .addCase(fetchPopularDishes.rejected, (state, action) => {
        state.popularLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch popular dishes';
      });

    builder
      .addCase(fetchOverview.pending, (state, action) => {
        state.overviewLoading = true;
        state.overviewRange = action.meta.arg;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch overview';
      });
  },
});

export const { clearSalesError } = salesSlice.actions;
export default salesSlice.reducer;
