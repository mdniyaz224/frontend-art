import type { RootState } from '../../Store/store';
import { attendanceKey } from './attendanceTypes';

export const selectAttendanceEntry = (state: RootState, staffId: string, date: string) =>
  state.attendance.entries[attendanceKey(staffId, date)];
