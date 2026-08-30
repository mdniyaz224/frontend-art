// ============================================================
// API Endpoints — Single Source of Truth
// ============================================================
// Every backend route the frontend calls is declared here exactly once,
// mirroring be-boiler's route files 1:1. Feature API services (e.g.
// staffApi.ts, inventoryApi.ts) import from this object instead of
// hardcoding path strings, so a backend route rename only ever requires
// updating this one file.
//
// Static routes are plain string literals; routes with path params are
// functions that return the interpolated path. Nothing here performs a
// request — these are paths only, consumed by axiosInstance calls in the
// feature *Api.ts files.

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
  },

  USERS: {
    BASE: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
  },

  STAFF: {
    BASE: '/staff',
    BY_ID: (id: string) => `/staff/${id}`,
    ACTIVATE: (id: string) => `/staff/${id}/activate`,
    DEACTIVATE: (id: string) => `/staff/${id}/deactivate`,
    ROLE: (id: string) => `/staff/${id}/role`,
    ATTENDANCE: (staffId: string) => `/staff/${staffId}/attendance`,
    ATTENDANCE_BY_DATE: (staffId: string, date: string) => `/staff/${staffId}/attendance/${date}`,
  },

  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
    CATEGORIES: '/products/categories',
    STATUS_SUMMARY: '/products/status-summary',
    ADJUSTMENTS: (id: string) => `/products/${id}/adjustments`,
  },

  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
    POPULAR_DISHES: '/dashboard/popular-dishes',
    OVERVIEW: '/dashboard/overview',
  },

  UPLOADS: {
    IMAGE: '/uploads/image',
  },
} as const;
