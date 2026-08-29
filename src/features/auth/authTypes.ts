// ============================================================
// Auth Types
// ============================================================
// Shaped to match be-boiler's User model exactly (src/models/user.model.ts) —
// a single `name` field and a bare `role` string, not the generic
// firstName/lastName/role-object shape a from-scratch ERP backend might use.

import type { Permission, StaffRole } from '../../types/common';

export interface User {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  // No refreshToken here — be-boiler sets it as an httpOnly cookie, never in the body.
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  permissions: Permission[];
  roles: string[];
}
