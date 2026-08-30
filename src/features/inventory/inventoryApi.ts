// ============================================================
// Inventory API Service
// ============================================================
// Matches be-boiler's src/routes/product.routes.ts and product.controller.ts
// exactly: PATCH (not PUT) for updates, a real DELETE (hard delete — Product
// already has Inactive/Draft states for soft-disable), dedicated
// /categories and /status-summary endpoints, and a nested /:id/adjustments
// sub-resource for auditable stock changes.

import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse } from '../../types/api';
import { buildQueryParams } from '../../utils/helpers';
import type {
  InventoryApiPagination,
  InventoryFilters,
  Product,
  ProductCreateFormValues,
  ProductStatusCounts,
  ProductUpdateFormValues,
  StockAdjustment,
} from './inventoryTypes';

export interface InventoryListParams extends InventoryFilters {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryListData {
  products: Product[];
  pagination: InventoryApiPagination;
}

export const getProductList = async (
  params: InventoryListParams,
): Promise<ApiResponse<InventoryListData>> => {
  const queryString = buildQueryParams({
    page: params.page,
    limit: params.pageSize,
    search: params.search,
    category: params.category,
    status: params.status || undefined,
    unit: params.unit || undefined,
    stock: params.stock || undefined,
    minQuantity: params.minQuantity,
    priceMin: params.priceMin,
    priceMax: params.priceMax,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  const response = await axiosInstance.get<ApiResponse<InventoryListData>>(
    `${API_ENDPOINTS.PRODUCTS.BASE}?${queryString}`,
  );
  return response.data;
};

export const getProductById = async (id: string): Promise<ApiResponse<{ product: Product }>> => {
  const response = await axiosInstance.get<ApiResponse<{ product: Product }>>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};

export const createProduct = async (
  data: ProductCreateFormValues,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await axiosInstance.post<ApiResponse<{ product: Product }>>(API_ENDPOINTS.PRODUCTS.BASE, data);
  return response.data;
};

export const updateProduct = async (
  id: string,
  data: ProductUpdateFormValues,
): Promise<ApiResponse<{ product: Product }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ product: Product }>>(
    API_ENDPOINTS.PRODUCTS.BY_ID(id),
    data,
  );
  return response.data;
};

export const deleteProduct = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
  return response.data;
};

export const getProductCategories = async (): Promise<ApiResponse<{ categories: string[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ categories: string[] }>>(
    API_ENDPOINTS.PRODUCTS.CATEGORIES,
  );
  return response.data;
};

export const getProductStatusCounts = async (): Promise<
  ApiResponse<{ counts: ProductStatusCounts }>
> => {
  const response = await axiosInstance.get<ApiResponse<{ counts: ProductStatusCounts }>>(
    API_ENDPOINTS.PRODUCTS.STATUS_SUMMARY,
  );
  return response.data;
};

export const adjustStock = async (
  id: string,
  delta: number,
  reason: string,
): Promise<ApiResponse<{ product: Product; adjustment: StockAdjustment }>> => {
  const response = await axiosInstance.post<
    ApiResponse<{ product: Product; adjustment: StockAdjustment }>
  >(API_ENDPOINTS.PRODUCTS.ADJUSTMENTS(id), { delta, reason });
  return response.data;
};

export interface StockAdjustmentListData {
  adjustments: StockAdjustment[];
  pagination: InventoryApiPagination;
}

export const getStockAdjustments = async (
  id: string,
  params: { page: number; limit: number },
): Promise<ApiResponse<StockAdjustmentListData>> => {
  const queryString = buildQueryParams({ page: params.page, limit: params.limit });
  const response = await axiosInstance.get<ApiResponse<StockAdjustmentListData>>(
    `${API_ENDPOINTS.PRODUCTS.ADJUSTMENTS(id)}?${queryString}`,
  );
  return response.data;
};
