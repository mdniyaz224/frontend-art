// ============================================================
// Upload API Service
// ============================================================
// Matches be-boiler's POST /api/v1/uploads/image — a multipart endpoint
// shared by any feature that needs an image URL (Staff profile pictures,
// Inventory product photos). Returns an absolute URL pointing at the
// backend's /uploads static file route.

import axiosInstance from './axios';
import { API_ENDPOINTS } from './apiEndpoints';
import type { ApiResponse } from '../types/api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  // The shared axios instance hardcodes `Content-Type: application/json` as
  // a default header, which stops axios from auto-detecting this FormData
  // body and setting the multipart boundary itself — override it to
  // `undefined` so that auto-detection kicks in for this one request.
  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
    API_ENDPOINTS.UPLOADS.IMAGE,
    formData,
    { headers: { 'Content-Type': undefined } },
  );
  return response.data.data.url;
};
