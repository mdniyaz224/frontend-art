// ============================================================
// Role → Permission Mapping
// ============================================================
// The backend authorizes purely by role (see `authorizeRoles` in be-boiler's
// rbac.middleware.ts) and never returns a permissions array on the user object.
// This map is the frontend's mirror of those route guards so `usePermission`
// can gate UI the same way the API gates requests.
//
// Keep this in sync with be-boiler's src/routes/staff.routes.ts.

import { PERMISSIONS } from './constants';
import type { StaffRole } from '../types/common';

const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.STAFF_CREATE,
    PERMISSIONS.STAFF_EDIT,
    PERMISSIONS.STAFF_DELETE,
    PERMISSIONS.STAFF_MANAGE_ROLE,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.INVENTORY_ADJUST_STOCK,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  manager: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.STAFF_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_EDIT,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.INVENTORY_ADJUST_STOCK,
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_EXPORT,
  ],
  // Cashiers see the sales dashboard (real-time restaurant view) but cannot
  // export financial reports — that stays admin/manager-only.
  cashier: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.INVENTORY_VIEW],
};

export const getPermissionsForRole = (role: string): string[] => {
  return ROLE_PERMISSIONS[role as StaffRole] ?? [];
};
