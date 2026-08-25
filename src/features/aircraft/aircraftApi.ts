// ============================================================
// Aircraft API Service
// ============================================================

import axiosInstance from '../../services/axios';
import type { ApiResponse, PaginatedResponse, ListQueryParams } from '../../types/api';
import type { Aircraft, AircraftFormValues } from './aircraftTypes';
import { buildQueryParams } from '../../utils/helpers';

const BASE_URL = '/aircraft';

export const getAircraftList = async (
  params: ListQueryParams,
): Promise<PaginatedResponse<Aircraft>> => {
  const queryString = buildQueryParams(params as Record<string, unknown>);
  const response = await axiosInstance.get<PaginatedResponse<Aircraft>>(
    `${BASE_URL}?${queryString}`,
  );
  return response.data;
};

export const getAircraftById = async (id: string): Promise<ApiResponse<Aircraft>> => {
  const response = await axiosInstance.get<ApiResponse<Aircraft>>(`${BASE_URL}/${id}`);
  return response.data;
};

export const createAircraft = async (
  data: AircraftFormValues,
): Promise<ApiResponse<Aircraft>> => {
  const response = await axiosInstance.post<ApiResponse<Aircraft>>(BASE_URL, data);
  return response.data;
};

export const updateAircraft = async (
  id: string,
  data: AircraftFormValues,
): Promise<ApiResponse<Aircraft>> => {
  const response = await axiosInstance.put<ApiResponse<Aircraft>>(`${BASE_URL}/${id}`, data);
  return response.data;
};

export const deleteAircraft = async (id: string): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete<ApiResponse<null>>(`${BASE_URL}/${id}`);
  return response.data;
};
