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
  // Aircraft
  AIRCRAFT_VIEW: 'AIRCRAFT_VIEW',
  AIRCRAFT_CREATE: 'AIRCRAFT_CREATE',
  AIRCRAFT_EDIT: 'AIRCRAFT_EDIT',
  AIRCRAFT_DELETE: 'AIRCRAFT_DELETE',
  // Users
  USER_VIEW: 'USER_VIEW',
  USER_CREATE: 'USER_CREATE',
  USER_EDIT: 'USER_EDIT',
  USER_DELETE: 'USER_DELETE',
  // Purchase Orders
  PURCHASE_ORDER_VIEW: 'PURCHASE_ORDER_VIEW',
  PURCHASE_ORDER_CREATE: 'PURCHASE_ORDER_CREATE',
  PURCHASE_ORDER_EDIT: 'PURCHASE_ORDER_EDIT',
  PURCHASE_ORDER_DELETE: 'PURCHASE_ORDER_DELETE',
  PURCHASE_ORDER_APPROVE: 'PURCHASE_ORDER_APPROVE',
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
