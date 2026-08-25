// ============================================================
// User API Service
// ============================================================

import axiosInstance from '../../services/axios';
import type { ApiResponse, PaginatedResponse, ListQueryParams } from '../../types/api';
import type { UserRecord, UserFormValues } from './userTypes';
import { buildQueryParams } from '../../utils/helpers';

const BASE_URL = '/users';

export const getUserList = async (params: ListQueryParams): Promise<PaginatedResponse<UserRecord>> => {
  const queryString = buildQueryParams(params as Record<string, unknown>);
  const response = await axiosInstance.get<PaginatedResponse<UserRecord>>(`${BASE_URL}?${queryString}`);
  return response.data;
};

export const getUserById = async (id: string): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.get<ApiResponse<UserRecord>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createUser = async (data: UserFormValues): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.post<ApiResponse<UserRecord>>(BASE_URL, data);
  return response.data;
};

export const updateUser = async (id: string, data: UserFormValues): Promise<ApiResponse<UserRecord>> => {
  const response = await axiosInstance.put<ApiResponse<UserRecord>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
