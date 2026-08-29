// ============================================================
// User Types
// ============================================================

import type { BaseEntity, Permission } from '../../types/common';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

// Generic firstName/lastName + role-object shape — does not match be-boiler's actual
// User model (a single `name` string and a bare role string, see auth/authTypes.ts's
// User interface). Reconcile this before wiring UsersPage up to the real API response.
export interface UserRecord extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: { id: string; name: string };
  status: UserStatus;
  permissions: Permission[];
  lastLoginAt?: string;
}

export interface UserFormValues {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  status: UserStatus;
  password?: string;
}

export interface UserState {
  list: UserRecord[];
  selectedUser: UserRecord | null;
  loading: boolean;
  detailLoading: boolean;
  submitting: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
