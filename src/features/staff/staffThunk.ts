// ============================================================
// Staff Thunks
// ============================================================

import { createApiThunk } from '../../utils/createApiThunk';
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
import type { Staff, StaffCreateFormValues, StaffUpdateFormValues } from './staffTypes';
import type { StaffRole } from '../../types/common';

/**
 * Fetch paginated staff list.
 */
export const fetchStaffList = createApiThunk<StaffListData, StaffListParams>(
  'staff/fetchList',
  async (params) => {
    const response = await getStaffList(params);
    return response.data;
  },
);

/**
 * Fetch a single staff member by ID.
 */
export const fetchStaffById = createApiThunk<Staff, string>('staff/fetchById', async (id) => {
  const response = await getStaffById(id);
  return response.data.staff;
});

/**
 * Create a new staff member.
 */
export const createStaffThunk = createApiThunk<Staff, StaffCreateFormValues>(
  'staff/create',
  async (data) => {
    const response = await createStaffApi(data);
    return response.data.staff;
  },
);

/**
 * Update an existing staff member's profile fields.
 */
export const updateStaffThunk = createApiThunk<Staff, { id: string; data: StaffUpdateFormValues }>(
  'staff/update',
  async ({ id, data }) => {
    const response = await updateStaffApi(id, data);
    return response.data.staff;
  },
);

/**
 * Toggle a staff member's active status (soft archive / restore).
 */
export const toggleStaffActiveThunk = createApiThunk<Staff, { id: string; isActive: boolean }>(
  'staff/toggleActive',
  async ({ id, isActive }) => {
    const response = isActive ? await deactivateStaffApi(id) : await activateStaffApi(id);
    return response.data.staff;
  },
);

/**
 * Reassign a staff member's role.
 */
export const assignStaffRoleThunk = createApiThunk<Staff, { id: string; role: StaffRole }>(
  'staff/assignRole',
  async ({ id, role }) => {
    const response = await assignStaffRoleApi(id, role);
    return response.data.staff;
  },
);
