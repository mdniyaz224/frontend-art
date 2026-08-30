// ============================================================
// User Thunks
// ============================================================

import { createApiThunk } from '../../utils/createApiThunk';
import { getUserList, getUserById } from './userApi';
import type { UserRecord } from './userTypes';
import type { ListQueryParams, PaginatedResponse } from '../../types/api';

export const fetchUserList = createApiThunk<PaginatedResponse<UserRecord>, ListQueryParams>(
  'users/fetchList',
  async (params) => getUserList(params),
);

export const fetchUserById = createApiThunk<UserRecord, string>('users/fetchById', async (id) => {
  const response = await getUserById(id);
  return response.data;
});
