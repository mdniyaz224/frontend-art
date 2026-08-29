// ============================================================
// Sales / Dashboard Analytics Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getDashboardSummary,
  getPopularDishes,
  getOverview,
  type PopularDishesParams,
} from './salesApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { DashboardSummary, OverviewPoint, OverviewRange, PopularDish } from './salesTypes';

export const fetchDashboardSummary = createAsyncThunk<DashboardSummary, void>(
  'sales/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDashboardSummary();
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchPopularDishes = createAsyncThunk<PopularDish[], PopularDishesParams>(
  'sales/fetchPopularDishes',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getPopularDishes(params);
      return response.data.dishes;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchOverview = createAsyncThunk<OverviewPoint[], OverviewRange>(
  'sales/fetchOverview',
  async (range, { rejectWithValue }) => {
    try {
      const response = await getOverview(range);
      return response.data.series;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
