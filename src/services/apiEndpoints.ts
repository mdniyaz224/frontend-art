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
