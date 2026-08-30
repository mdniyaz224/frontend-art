import { createSlice } from '@reduxjs/toolkit';
import type { UserState } from './userTypes';
import { DEFAULT_PAGINATION } from '../../types/api';
import { fetchUserList, fetchUserById } from './userThunk';

const initialState: UserState = {
  list: [],
  selectedUser: null,
  loading: false,
  detailLoading: false,
  submitting: false,
  error: null,
  pagination: DEFAULT_PAGINATION,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError(state) {
      state.error = null;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to fetch users';
      });

    builder
      .addCase(fetchUserById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch user';
      });
  },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
