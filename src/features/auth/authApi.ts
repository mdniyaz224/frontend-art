// ============================================================
// Auth API Service
// ============================================================
// Talks to be-boiler's real /auth and /users routes — no mock mode.
// Route paths and response envelopes match src/routes/auth.routes.ts,
// src/routes/user.routes.ts and src/controllers/auth.controller.ts exactly.

import axiosInstance from '../../services/axios';
import type { ApiResponse } from '../../types/api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from './authTypes';

export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
  return response.data;
};

/**
 * The refresh token itself is never sent from JS — it travels as an httpOnly
 * cookie set by the backend, attached automatically via axios `withCredentials`.
 */
export const refreshTokenApi = async (): Promise<ApiResponse<RefreshTokenResponse>> => {
  const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh-token');
  return response.data;
};

export const getCurrentUserApi = async (): Promise<ApiResponse<{ user: User }>> => {
  const response = await axiosInstance.get<ApiResponse<{ user: User }>>('/users/me');
  return response.data;
};
