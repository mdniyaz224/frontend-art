// ============================================================
// Centralized Axios Instance
// ============================================================
// All feature API files import this instance.
// Interceptors are attached in interceptors.ts and called at app startup.

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  withCredentials: true, // sends the httpOnly refresh-token cookie set by the backend
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default axiosInstance;
