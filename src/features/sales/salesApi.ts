// ============================================================
// Sales / Dashboard Analytics API Service
// ============================================================
// Matches be-boiler's src/routes/dashboard.routes.ts — three read-only
// GET endpoints, all ADMIN/MANAGER/CASHIER accessible.

import axiosInstance from '../../services/axios';
import type { ApiResponse } from '../../types/api';
import { buildQueryParams } from '../../utils/helpers';
import type { DashboardSummary, OverviewPoint, OverviewRange, PopularDish, PopularDishesSortBy } from './salesTypes';

const BASE_URL = '/dashboard';

export const getDashboardSummary = async (): Promise<ApiResponse<DashboardSummary>> => {
  const response = await axiosInstance.get<ApiResponse<DashboardSummary>>(`${BASE_URL}/summary`);
  return response.data;
};

export interface PopularDishesParams {
  sortBy: PopularDishesSortBy;
  limit?: number;
  periodDays?: number;
}

export const getPopularDishes = async (
  params: PopularDishesParams,
): Promise<ApiResponse<{ dishes: PopularDish[] }>> => {
  const queryString = buildQueryParams({
    sortBy: params.sortBy,
    limit: params.limit,
    periodDays: params.periodDays,
  });
  const response = await axiosInstance.get<ApiResponse<{ dishes: PopularDish[] }>>(
    `${BASE_URL}/popular-dishes?${queryString}`,
  );
  return response.data;
};

export const getOverview = async (
  range: OverviewRange,
): Promise<ApiResponse<{ range: OverviewRange; series: OverviewPoint[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ range: OverviewRange; series: OverviewPoint[] }>>(
    `${BASE_URL}/overview?range=${range}`,
  );
  return response.data;
};
