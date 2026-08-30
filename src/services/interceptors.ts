import axiosInstance from './axios';
import { API_ENDPOINTS } from './apiEndpoints';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '../types/api';
import type { RefreshTokenResponse } from '../features/auth/authTypes';
import { STORAGE_KEYS } from '../utils/constants';

export const getAccessToken = (): string | null => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

export const setAccessToken = (accessToken: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
};

export const clearAccessToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
};

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setupInterceptors = (): void => {
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosInstance.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (!originalRequest) {
        return Promise.reject(error);
      }

      const status = error.response?.status;

      // A 401 from login/logout/refresh means bad credentials or no session,
      // not an expired access token — none of them should trigger a refresh.
      const isAuthEndpoint =
        originalRequest.url === API_ENDPOINTS.AUTH.LOGIN ||
        originalRequest.url === API_ENDPOINTS.AUTH.LOGOUT ||
        originalRequest.url === API_ENDPOINTS.AUTH.REFRESH_TOKEN;

      if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return axiosInstance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          const { data } = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
            API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          );

          const newAccessToken = data.data.accessToken;
          setAccessToken(newAccessToken);
          processQueue(null, newAccessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearAccessToken();

          window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        console.error('[Interceptor] Forbidden — insufficient permissions');
      }

      if (status && status >= 500) {
        console.error('[Interceptor] Server error', error.response?.data);
      }

      return Promise.reject(error);
    },
  );
};
