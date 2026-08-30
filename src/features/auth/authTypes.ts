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
