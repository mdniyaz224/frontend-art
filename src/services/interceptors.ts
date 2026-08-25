// ============================================================
// Axios Interceptors — Request & Response
// ============================================================
//
// REQUEST INTERCEPTOR
// - Attaches the Authorization header with the Bearer token
// - Skips if no token is present (public endpoints)
//
// RESPONSE INTERCEPTOR
// - Handles global HTTP error statuses
// - Implements refresh-token flow with request queuing
//
// REFRESH TOKEN FLOW
// 1. A request returns 401 (token expired)
// 2. If no refresh is in progress, start one:
//    a. Set isRefreshing = true
//    b. Call the refresh endpoint
//    c. Update stored tokens
//    d. Retry the original request
//    e. Process the queued requests
// 3. If a refresh IS already in progress, queue the failed request
//    and return a Promise that resolves/rejects when the refresh completes.
// 4. If the refresh itself fails:
//    a. Reject all queued requests
//    b. Clear auth state
//    c. Redirect to login

import axiosInstance from './axios';
import type { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// ----- Token helpers -----

const TOKEN_KEY = 'erp_access_token';
const REFRESH_TOKEN_KEY = 'erp_refresh_token';

export const getAccessToken = (): string | null => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ----- Refresh-token queue -----

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

// ----- Setup function — called once at app startup -----

export const setupInterceptors = (): void => {
  // ==================== REQUEST INTERCEPTOR ====================
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

  // ==================== RESPONSE INTERCEPTOR ====================
  axiosInstance.interceptors.response.use(
    // ---- Success (2xx) ----
    (response) => response,

    // ---- Error ----
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // Guard: if there's no config we can't retry
      if (!originalRequest) {
        return Promise.reject(error);
      }

      const status = error.response?.status;

      // ---- 401: Attempt token refresh ----
      if (status === 401 && !originalRequest._retry) {
        // Prevent infinite retry loops
        originalRequest._retry = true;

        if (isRefreshing) {
          // Another refresh is already in progress — queue this request
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
          const refreshToken = getRefreshToken();
          if (!refreshToken) throw new Error('No refresh token available');

          const { data } = await axiosInstance.post('/auth/refresh', {
            refreshToken,
          });

          const newAccessToken: string = data.data.accessToken;
          const newRefreshToken: string = data.data.refreshToken;

          setTokens(newAccessToken, newRefreshToken);
          processQueue(null, newAccessToken);

          // Retry the original request with the new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          clearTokens();

          // Redirect to login — avoid using React Router here to keep
          // interceptors framework-agnostic
          window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // ---- 403: Forbidden ----
      if (status === 403) {
        console.error('[Interceptor] Forbidden — insufficient permissions');
      }

      // ---- 500: Server error ----
      if (status && status >= 500) {
        console.error('[Interceptor] Server error', error.response?.data);
      }

      // Always reject so that Redux thunks can handle feature-specific errors
      return Promise.reject(error);
    },
  );
};
