// ============================================================
// Purchase Order API Service
// ============================================================

import axiosInstance from '../../services/axios';
import type { ApiResponse, PaginatedResponse, ListQueryParams } from '../../types/api';
import type { PurchaseOrder, PurchaseOrderFormValues } from './purchaseOrderTypes';
import { buildQueryParams } from '../../utils/helpers';

const BASE_URL = '/purchase-orders';

export const getPurchaseOrderList = async (params: ListQueryParams): Promise<PaginatedResponse<PurchaseOrder>> => {
  const queryString = buildQueryParams(params as Record<string, unknown>);
  const response = await axiosInstance.get<PaginatedResponse<PurchaseOrder>>(`${BASE_URL}?${queryString}`);
  return response.data;
};

export const getPurchaseOrderById = async (id: string): Promise<ApiResponse<PurchaseOrder>> => {
  const response = await axiosInstance.get<ApiResponse<PurchaseOrder>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createPurchaseOrder = async (data: PurchaseOrderFormValues): Promise<ApiResponse<PurchaseOrder>> => {
  const response = await axiosInstance.post<ApiResponse<PurchaseOrder>>(BASE_URL, data);
  return response.data;
};

export const updatePurchaseOrder = async (id: string, data: PurchaseOrderFormValues): Promise<ApiResponse<PurchaseOrder>> => {
  const response = await axiosInstance.put<ApiResponse<PurchaseOrder>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deletePurchaseOrder = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
