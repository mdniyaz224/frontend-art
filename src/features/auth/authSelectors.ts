// ============================================================
// Auth Selectors
// ============================================================

import type { RootState } from '../../Store/store';

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthInitializing = (state: RootState) => state.auth.initializing;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectPermissions = (state: RootState) => state.auth.permissions;
export const selectRoles = (state: RootState) => state.auth.roles;
export const selectUserFullName = (state: RootState) => {
  const user = state.auth.user;
  if (!user) return '';
  return user.name;
};
