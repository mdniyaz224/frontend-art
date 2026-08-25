// ============================================================
// Aircraft Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAircraftList,
  getAircraftById,
  createAircraft as createAircraftApi,
  updateAircraft as updateAircraftApi,
  deleteAircraft as deleteAircraftApi,
} from './aircraftApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { Aircraft, AircraftFormValues } from './aircraftTypes';
import type { ListQueryParams, PaginatedResponse } from '../../types/api';

/**
 * Fetch paginated aircraft list.
 */
export const fetchAircraftList = createAsyncThunk<PaginatedResponse<Aircraft>, ListQueryParams>(
  'aircraft/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await getAircraftList(params);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Fetch a single aircraft by ID.
 */
export const fetchAircraftById = createAsyncThunk<Aircraft, string>(
  'aircraft/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAircraftById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Create a new aircraft.
 */
export const createAircraftThunk = createAsyncThunk<Aircraft, AircraftFormValues>(
  'aircraft/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await createAircraftApi(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Update an existing aircraft.
 */
export const updateAircraftThunk = createAsyncThunk<
  Aircraft,
  { id: string; data: AircraftFormValues }
>(
  'aircraft/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateAircraftApi(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

/**
 * Delete an aircraft by ID.
 */
export const deleteAircraftThunk = createAsyncThunk<string, string>(
  'aircraft/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteAircraftApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
