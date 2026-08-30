import axiosInstance from './axios';
import { API_ENDPOINTS } from './apiEndpoints';
import type { ApiResponse } from '../types/api';

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  // axiosInstance defaults Content-Type to application/json, which blocks
  // axios from auto-setting the multipart boundary for FormData — override
  // it to undefined so auto-detection kicks in for this request.
  const response = await axiosInstance.post<ApiResponse<{ url: string }>>(
    API_ENDPOINTS.UPLOADS.IMAGE,
    formData,
    { headers: { 'Content-Type': undefined } },
  );
  return response.data.data.url;
};
