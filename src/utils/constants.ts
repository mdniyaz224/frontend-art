// ============================================================
// Application Constants
// ============================================================

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

/** Local storage keys */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'erp_access_token',
  REFRESH_TOKEN: 'erp_refresh_token',
  SIDEBAR_COLLAPSED: 'erp_sidebar_collapsed',
  THEME_MODE: 'erp_theme_mode',
} as const;

/** HTTP Status Codes */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
} as const;

/** Permission constants — used across features */
export const PERMISSIONS = {
  // Staff — mirrors be-boiler's authorizeRoles() guards on /staff routes
  STAFF_VIEW: 'STAFF_VIEW',
  STAFF_CREATE: 'STAFF_CREATE',
  STAFF_EDIT: 'STAFF_EDIT',
  STAFF_DELETE: 'STAFF_DELETE',
  STAFF_MANAGE_ROLE: 'STAFF_MANAGE_ROLE',
  ATTENDANCE_VIEW: 'ATTENDANCE_VIEW',
  ATTENDANCE_MARK: 'ATTENDANCE_MARK',
  // Inventory — mirrors be-boiler's authorizeRoles() guards on /products routes
  INVENTORY_VIEW: 'INVENTORY_VIEW',
  INVENTORY_CREATE: 'INVENTORY_CREATE',
  INVENTORY_EDIT: 'INVENTORY_EDIT',
  INVENTORY_DELETE: 'INVENTORY_DELETE',
  INVENTORY_ADJUST_STOCK: 'INVENTORY_ADJUST_STOCK',
  // Users
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
  USER_DELETE: 'USER_DELETE',
  // Maintenance
  MAINTENANCE_VIEW: 'MAINTENANCE_VIEW',
  MAINTENANCE_CREATE: 'MAINTENANCE_CREATE',
  MAINTENANCE_EDIT: 'MAINTENANCE_EDIT',
  MAINTENANCE_DELETE: 'MAINTENANCE_DELETE',
  // Roles
  ROLE_VIEW: 'ROLE_VIEW',
  ROLE_CREATE: 'ROLE_CREATE',
  ROLE_EDIT: 'ROLE_EDIT',
  ROLE_DELETE: 'ROLE_DELETE',
  // Dashboard
  DASHBOARD_VIEW: 'DASHBOARD_VIEW',
  // Reports
  REPORT_VIEW: 'REPORT_VIEW',
  REPORT_EXPORT: 'REPORT_EXPORT',
} as const;

/** Sidebar drawer width */
export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

/** Header height */
export const HEADER_HEIGHT = 64;
