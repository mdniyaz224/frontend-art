import { createAsyncThunk } from '@reduxjs/toolkit';
import { createApiThunk } from '../../utils/createApiThunk';
import { loginApi, logoutApi, getCurrentUserApi } from './authApi';
import { setAccessToken, clearAccessToken } from '../../services/interceptors';
import type { LoginRequest, LoginResponse, User } from './authTypes';

export const login = createApiThunk<LoginResponse, LoginRequest>('auth/login', async (credentials) => {
  const response = await loginApi(credentials);
  setAccessToken(response.data.accessToken);
  return response.data;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi().catch(() => undefined);
  clearAccessToken();
});

export const getCurrentUser = createApiThunk<User, void>(
  'auth/getCurrentUser',
  async () => {
    const response = await getCurrentUserApi();
    return response.data.user;
  },
  { onError: clearAccessToken },
);
