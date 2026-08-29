// ============================================================
// Staff Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getStaffList,
  getStaffById,
  createStaff as createStaffApi,
  updateStaff as updateStaffApi,
  activateStaff as activateStaffApi,
  deactivateStaff as deactivateStaffApi,
  assignStaffRole as assignStaffRoleApi,
  type StaffListParams,
  type StaffListData,
} from './staffApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { Staff, StaffCreateFormValues, StaffUpdateFormValues } from './staffTypes';
import type { StaffRole } from '../../types/common';

/**
 * Fetch paginated staff list.
 */
export const fetchStaffList = createAsyncThunk<StaffListData, StaffListParams>(
  'staff/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await getStaffList(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Fetch a single staff member by ID.
 */
export const fetchStaffById = createAsyncThunk<Staff, string>(
  'staff/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getStaffById(id);
      return response.data.staff;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Create a new staff member.
 */
export const createStaffThunk = createAsyncThunk<Staff, StaffCreateFormValues>(
  'staff/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createStaffApi(data);
      return response.data.staff;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Update an existing staff member's profile fields.
 */
export const updateStaffThunk = createAsyncThunk<
  Staff,
  { id: string; data: StaffUpdateFormValues }
>('staff/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await updateStaffApi(id, data);
    return response.data.staff;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

/**
 * Toggle a staff member's active status (soft archive / restore).
 */
export const toggleStaffActiveThunk = createAsyncThunk<
  Staff,
  { id: string; isActive: boolean }
>('staff/toggleActive', async ({ id, isActive }, { rejectWithValue }) => {
  try {
    const response = isActive ? await deactivateStaffApi(id) : await activateStaffApi(id);
    return response.data.staff;
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

/**
 * Reassign a staff member's role.
 */
export const assignStaffRoleThunk = createAsyncThunk<Staff, { id: string; role: StaffRole }>(
  'staff/assignRole',
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await assignStaffRoleApi(id, role);
      return response.data.staff;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
