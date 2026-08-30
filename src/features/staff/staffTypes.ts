import type { BaseEntity, StaffRole } from '../../types/common';
import type { PaginationMeta } from '../../types/api';

export interface Staff extends BaseEntity {
  name: string;
  email: string;
  role: StaffRole;
  isActive: boolean;

  // Required by the create form, but not by the backend User schema — the
  // seed:admin bootstrap script creates a user without these, so treat them
  // as optional wherever a Staff row gets rendered.
  phone?: string;
  salary?: number;
  dateOfBirth?: string;

  age?: number;
  shiftStart?: string;
  shiftEnd?: string;
  address?: string;
  additionalDetails?: string;
  profilePicture?: string;
}

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
  pagination: PaginationMeta;
}

export const STAFF_ROLE_OPTIONS: { label: string; value: StaffRole }[] = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Cashier', value: 'cashier' },
];

export const STAFF_SORT_FIELDS = ['name', 'email', 'salary', 'dateOfBirth', 'createdAt'] as const;
