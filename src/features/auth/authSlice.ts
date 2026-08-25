// ============================================================
// Auth Redux Slice
// ============================================================

import { createSlice } from '@reduxjs/toolkit';
import type { AuthState } from './authTypes';
import { login, logout, getCurrentUser } from './authThunk';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initializing: true,
  error: null,
  permissions: [],
  roles: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setInitialized(state) {
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    // ---- Login ----
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.permissions = action.payload.user.permissions;
        state.roles = [action.payload.user.role.name];
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      });

    // ---- Logout ----
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, () => {
        return { ...initialState, initializing: false };
      })
      .addCase(logout.rejected, () => {
        return { ...initialState, initializing: false };
      });

    // ---- Get Current User ----
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.initializing = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.permissions = action.payload.permissions;
        state.roles = [action.payload.role.name];
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.initializing = false;
        state.isAuthenticated = false;
        state.user = null;
        state.permissions = [];
        state.roles = [];
      });
  },
});

export const { clearAuthError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
