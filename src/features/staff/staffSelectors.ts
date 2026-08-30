import type { RootState } from '../../Store/store';

export const selectStaffList = (state: RootState) => state.staff.list;
export const selectStaffLoading = (state: RootState) => state.staff.loading;
export const selectStaffDetailLoading = (state: RootState) => state.staff.detailLoading;
export const selectStaffSubmitting = (state: RootState) => state.staff.submitting;
export const selectStaffError = (state: RootState) => state.staff.error;
export const selectStaffPagination = (state: RootState) => state.staff.pagination;
export const selectSelectedStaff = (state: RootState) => state.staff.selectedStaff;
