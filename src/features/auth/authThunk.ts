// ============================================================
// Auth Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { createApiThunk } from '../../utils/createApiThunk';
import { loginApi, logoutApi, getCurrentUserApi } from './authApi';
import { setAccessToken, clearAccessToken } from '../../services/interceptors';
import type { LoginRequest, LoginResponse, User } from './authTypes';

/**
 * Login thunk — authenticates user and stores the access token.
 * The refresh token is set as an httpOnly cookie by the backend response
 * itself; there is nothing for the client to store for it.
 */
export const login = createApiThunk<LoginResponse, LoginRequest>('auth/login', async (credentials) => {
  const response = await loginApi(credentials);
  setAccessToken(response.data.accessToken);
  return response.data;
});

/**
 * Logout thunk — clears tokens and user state.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutApi();
  } catch {
    // Ignore logout errors
  } finally {
    clearAccessToken();
  }
});

/**
 * Get current user thunk — fetches the authenticated user's profile.
 * Used on app initialization to restore the session.
 */
export const getCurrentUser = createApiThunk<User, void>(
  'auth/getCurrentUser',
  async () => {
    const response = await getCurrentUserApi();
    return response.data.user;
  },
  { onError: clearAccessToken },
);
