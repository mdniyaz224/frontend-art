// ============================================================
// Staff Types
// ============================================================
// Mirrors be-boiler's User model + staff validators exactly
// (src/models/user.model.ts, src/validators/staff.validator.ts) —
// staff members ARE users; there is no separate staff collection.

import type { BaseEntity, StaffRole } from '../../types/common';

export interface Staff extends BaseEntity {
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;
  // These are required by createStaffSchema for anyone created through
  // POST /staff, but the User schema itself doesn't enforce them — the
  // seed:admin bootstrap script creates a User without any of these, so
  // they must be treated as optional wherever a Staff row is rendered.
  phone?: string;
  salary?: number;
  dateOfBirth?: string;
  /** Mongoose virtual derived from dateOfBirth — absent when dateOfBirth is unset. */
  age?: number;
  shiftStart?: string;
  shiftEnd?: string;
  address?: string;
  additionalDetails?: string;
  profilePicture?: string;
}

/** Fields accepted by POST /staff (createStaffSchema). */
export interface StaffCreateFormValues {
  name: string;
  email: string;
  password: string;
  role: StaffRole;
  phone: string;
  salary: number;
  dateOfBirth: string | null;
  shiftStart: string;
  shiftEnd: string;
  address?: string;
  additionalDetails?: string;
  profilePicture?: string;
}

/** Fields accepted by PATCH /staff/:id (updateStaffSchema) — no password or role. */
export interface StaffUpdateFormValues {
  name: string;
  email: string;
  phone: string;
  salary: number;
  dateOfBirth: string | null;
  shiftStart: string;
  shiftEnd: string;
  address?: string;
  additionalDetails?: string;
  profilePicture?: string;
}

/** Raw pagination shape returned by GET /staff (listStaff service). */
export interface StaffApiPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StaffState {
  list: Staff[];
  selectedStaff: Staff | null;
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

export const STAFF_ROLE_OPTIONS: { label: string; value: StaffRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Cashier', value: 'cashier' },
];

/** Matches STAFF_SORT_FIELDS in be-boiler's staff.validator.ts. */
export const STAFF_SORT_FIELDS = ['name', 'email', 'salary', 'dateOfBirth', 'createdAt'] as const;
