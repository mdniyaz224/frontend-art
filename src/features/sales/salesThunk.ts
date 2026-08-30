import { createApiThunk } from '../../utils/createApiThunk';
import {
  getDashboardSummary,
  getPopularDishes,
  getOverview,
  type PopularDishesParams,
} from './salesApi';
import type { DashboardSummary, OverviewPoint, OverviewRange, PopularDish } from './salesTypes';

export const fetchDashboardSummary = createApiThunk<DashboardSummary, void>(
  'sales/fetchSummary',
  async () => {
    const response = await getDashboardSummary();
    return response.data;
  },
);

export const fetchPopularDishes = createApiThunk<PopularDish[], PopularDishesParams>(
  'sales/fetchPopularDishes',
  async (params) => {
    const response = await getPopularDishes(params);
    return response.data.dishes;
  },
);

export const fetchOverview = createApiThunk<OverviewPoint[], OverviewRange>(
  'sales/fetchOverview',
  async (range) => {
    const response = await getOverview(range);
    return response.data.series;
  },
);
