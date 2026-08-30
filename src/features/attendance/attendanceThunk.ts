import { createApiThunk } from '../../utils/createApiThunk';
import { markAttendance as markAttendanceApi, getAttendanceForDate } from './attendanceApi';
import type { AttendanceStatus } from './attendanceTypes';

export const fetchAttendanceForDate = createApiThunk<
  { staffId: string; date: string; status: AttendanceStatus | null },
  { staffId: string; date: string }
>('attendance/fetchForDate', async ({ staffId, date }) => {
  const record = await getAttendanceForDate(staffId, date);
  return { staffId, date, status: record?.status ?? null };
});

export const markAttendanceThunk = createApiThunk<
  { staffId: string; date: string; status: AttendanceStatus },
  { staffId: string; date: string; status: AttendanceStatus }
>('attendance/mark', async ({ staffId, date, status }) => {
  const response = await markAttendanceApi(staffId, date, status);
  return { staffId, date, status: response.data.attendance.status };
});
