import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse } from '../../types/api';
import { buildQueryParams } from '../../utils/helpers';
import type { Staff, StaffApiPagination, StaffCreateFormValues, StaffUpdateFormValues } from './staffTypes';
import type { StaffRole } from '../../types/common';

export interface StaffListParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  role?: StaffRole | '';
  includeInactive?: boolean;
}

export interface StaffListData {
  staff: Staff[];
  pagination: StaffApiPagination;
}

export const getStaffList = async (
  params: StaffListParams,
): Promise<ApiResponse<StaffListData>> => {
  const queryString = buildQueryParams({
    page: params.page,
    limit: params.pageSize,
    search: params.search,
    role: params.role || undefined,
    includeInactive: params.includeInactive,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  const response = await axiosInstance.get<ApiResponse<StaffListData>>(
    `${API_ENDPOINTS.STAFF.BASE}?${queryString}`,
  );
  return response.data;
};

export const getStaffById = async (id: string): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.get<ApiResponse<{ staff: Staff }>>(API_ENDPOINTS.STAFF.BY_ID(id));
  return response.data;
};

export const createStaff = async (
  data: StaffCreateFormValues,
): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.post<ApiResponse<{ staff: Staff }>>(API_ENDPOINTS.STAFF.BASE, data);
  return response.data;
};

// PATCH, not PUT — the backend route only accepts partial updates.
export const updateStaff = async (
  id: string,
  data: StaffUpdateFormValues,
): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ staff: Staff }>>(
    API_ENDPOINTS.STAFF.BY_ID(id),
    data,
  );
  return response.data;
};

// Staff are soft-archived — there is no hard-delete endpoint.
export const deactivateStaff = async (id: string): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ staff: Staff }>>(
    API_ENDPOINTS.STAFF.DEACTIVATE(id),
  );
  return response.data;
};

export const activateStaff = async (id: string): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ staff: Staff }>>(
    API_ENDPOINTS.STAFF.ACTIVATE(id),
  );
  return response.data;
};

export const assignStaffRole = async (
  id: string,
  role: StaffRole,
): Promise<ApiResponse<{ staff: Staff }>> => {
  const response = await axiosInstance.patch<ApiResponse<{ staff: Staff }>>(
    API_ENDPOINTS.STAFF.ROLE(id),
    { role },
  );
  return response.data;
};
