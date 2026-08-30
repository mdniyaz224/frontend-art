import type { RootState } from '../../Store/store';

export const selectUserList = (state: RootState) => state.users.list;
export const selectUserLoading = (state: RootState) => state.users.loading;
export const selectUserError = (state: RootState) => state.users.error;
export const selectUserPagination = (state: RootState) => state.users.pagination;
export const selectSelectedUser = (state: RootState) => state.users.selectedUser;
