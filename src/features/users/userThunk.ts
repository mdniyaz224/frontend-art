// ============================================================
// User Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { getUserList, getUserById } from './userApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { UserRecord } from './userTypes';
import type { ListQueryParams, PaginatedResponse } from '../../types/api';

export const fetchUserList = createAsyncThunk<PaginatedResponse<UserRecord>, ListQueryParams>(
  'users/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      return await getUserList(params);
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

export const fetchUserById = createAsyncThunk<UserRecord, string>(
  'users/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);
