// ============================================================
// Attendance API Service
// ============================================================
// Matches be-boiler's nested routes exactly:
//   PUT /staff/:id/attendance/:date   { status } -> { attendance }
//   GET /staff/:id/attendance         ?from&to&page&limit -> { attendance[], pagination }
// There is no cross-staff attendance endpoint — every call is scoped to one
// staff member, so the UI fetches per row.

import axiosInstance from '../../services/axios';
import type { ApiResponse } from '../../types/api';
import type { Attendance, AttendanceStatus } from './attendanceTypes';

export const markAttendance = async (
  staffId: string,
  date: string,
  status: AttendanceStatus,
): Promise<ApiResponse<{ attendance: Attendance }>> => {
  const response = await axiosInstance.put<ApiResponse<{ attendance: Attendance }>>(
    `/staff/${staffId}/attendance/${date}`,
    { status },
  );
  return response.data;
};

interface AttendanceListData {
  attendance: Attendance[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

/** Fetches the single attendance record for one staff member on one date, if any. */
export const getAttendanceForDate = async (
  staffId: string,
  date: string,
): Promise<Attendance | null> => {
  const response = await axiosInstance.get<ApiResponse<AttendanceListData>>(
    `/staff/${staffId}/attendance`,
    { params: { from: date, to: date, page: 1, limit: 1 } },
  );
  return response.data.data.attendance[0] ?? null;
};
