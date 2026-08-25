// ============================================================
// Auth Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, logoutApi, getCurrentUserApi } from './authApi';
import { setTokens, clearTokens } from '../../services/interceptors';
import { getApiErrorMessage } from '../../utils/helpers';
import type { LoginRequest, LoginResponse, User } from './authTypes';

/**
 * Login thunk — authenticates user and stores tokens.
 */
export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      // Store tokens in localStorage for the interceptor
      setTokens(response.data.accessToken, response.data.refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Logout thunk — clears tokens and user state.
 */
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutApi();
  } catch {
    // Ignore logout errors
  } finally {
    clearTokens();
  }
});

/**
 * Get current user thunk — fetches the authenticated user's profile.
 * Used on app initialization to restore the session.
 */
export const getCurrentUser = createAsyncThunk<User, void>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUserApi();
      return response.data;
    } catch (error) {
      clearTokens();
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
