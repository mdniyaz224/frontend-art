// ============================================================
// Auth API Service
// ============================================================

import axiosInstance from '../../services/axios';
import { PERMISSIONS } from '../../utils/constants';
import type { ApiResponse } from '../../types/api';
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from './authTypes';

// Toggle this to false when your real backend is ready
const USE_MOCK = true;

export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: '1',
              email: credentials.email,
              firstName: 'Admin',
              lastName: 'User',
              role: { id: 'r1', name: 'Admin', description: 'System Administrator' },
              permissions: Object.values(PERMISSIONS),
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            accessToken: 'mock-jwt-access-token',
            refreshToken: 'mock-jwt-refresh-token',
          },
          message: 'Login successful',
        });
      }, 1000);
    });
  }

  const response = await axiosInstance.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  if (USE_MOCK) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ success: true, data: null, message: 'Logged out' }), 500),
    );
  }

  const response = await axiosInstance.post<ApiResponse<null>>('/auth/logout');
  return response.data;
};

export const refreshTokenApi = async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: { accessToken: 'new-mock-access-token', refreshToken: 'new-mock-refresh-token' },
          message: 'Token refreshed',
        });
      }, 500);
    });
  }

  const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const getCurrentUserApi = async (): Promise<ApiResponse<User>> => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            id: '1',
            email: 'admin@aerofleet.com',
            firstName: 'Admin',
            lastName: 'User',
            role: { id: 'r1', name: 'Admin', description: 'System Administrator' },
            permissions: Object.values(PERMISSIONS),
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          message: 'User fetched',
        });
      }, 500);
    });
  }

  const response = await axiosInstance.get<ApiResponse<User>>('/auth/me');
  return response.data;
};
