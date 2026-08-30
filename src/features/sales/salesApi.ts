import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse } from '../../types/api';
import { buildQueryParams } from '../../utils/helpers';
import type { DashboardSummary, OverviewPoint, OverviewRange, PopularDish, PopularDishesSortBy } from './salesTypes';

export const getDashboardSummary = async (): Promise<ApiResponse<DashboardSummary>> => {
  const response = await axiosInstance.get<ApiResponse<DashboardSummary>>(API_ENDPOINTS.DASHBOARD.SUMMARY);
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
    `${API_ENDPOINTS.DASHBOARD.POPULAR_DISHES}?${queryString}`,
  );
  return response.data;
};

export const getOverview = async (
  range: OverviewRange,
): Promise<ApiResponse<{ range: OverviewRange; series: OverviewPoint[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ range: OverviewRange; series: OverviewPoint[] }>>(
    `${API_ENDPOINTS.DASHBOARD.OVERVIEW}?range=${range}`,
  );
  return response.data;
};
