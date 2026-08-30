// ============================================================
// Auth API Service
// ============================================================

import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse } from '../../types/api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from './authTypes';

export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT);
  return response.data;
};

export const refreshTokenApi = async (): Promise<ApiResponse<RefreshTokenResponse>> => {
  const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
  return response.data;
};

export const getCurrentUserApi = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await axiosInstance.get<ApiResponse<{ user: User }>>(API_ENDPOINTS.USERS.ME);
  return response.data;
};
