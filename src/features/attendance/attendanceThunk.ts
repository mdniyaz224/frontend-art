// ============================================================
// Attendance Thunks
// ============================================================

import { createAsyncThunk } from '@reduxjs/toolkit';
import { markAttendance as markAttendanceApi, getAttendanceForDate } from './attendanceApi';
import { getApiErrorMessage } from '../../utils/helpers';
import type { AttendanceStatus } from './attendanceTypes';

export const fetchAttendanceForDate = createAsyncThunk<
  { staffId: string; date: string; status: AttendanceStatus | null },
  { staffId: string; date: string }
>('attendance/fetchForDate', async ({ staffId, date }, { rejectWithValue }) => {
  try {
    const record = await getAttendanceForDate(staffId, date);
    return { staffId, date, status: record?.status ?? null };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});

export const markAttendanceThunk = createAsyncThunk<
  { staffId: string; date: string; status: AttendanceStatus },
  { staffId: string; date: string; status: AttendanceStatus }
>('attendance/mark', async ({ staffId, date, status }, { rejectWithValue }) => {
  try {
    const response = await markAttendanceApi(staffId, date, status);
    return { staffId, date, status: response.data.attendance.status };
  } catch (error) {
    return rejectWithValue(getApiErrorMessage(error));
  }
});
