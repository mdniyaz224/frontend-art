import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse, PaginatedResponse, ListQueryParams } from '../../types/api';
import type { UserRecord, UserFormValues } from './userTypes';
import { buildQueryParams } from '../../utils/helpers';

// Only GET /users exists on the backend today — create/update/delete below
// have no matching route; account management lives under /staff instead.
export const getUserList = async (params: ListQueryParams): Promise<PaginatedResponse<UserRecord>> => {
  const queryString = buildQueryParams(params as Record<string, unknown>);
  const response = await axiosInstance.get<PaginatedResponse<UserRecord>>(
    `${API_ENDPOINTS.USERS.BASE}?${queryString}`,
  );
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.get<ApiResponse<UserRecord>>(API_ENDPOINTS.USERS.BY_ID(id));
  return response.data;
};

export const createUser = async (data: UserFormValues): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.post<ApiResponse<UserRecord>>(API_ENDPOINTS.USERS.BASE, data);
  return response.data;
};

export const updateUser = async (id: string, data: UserFormValues): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.put<ApiResponse<UserRecord>>(API_ENDPOINTS.USERS.BY_ID(id), data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(API_ENDPOINTS.USERS.BY_ID(id));
  return response.data;
};
