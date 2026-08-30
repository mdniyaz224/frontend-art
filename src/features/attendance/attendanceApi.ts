import axiosInstance from '../../services/axios';
import { API_ENDPOINTS } from '../../services/apiEndpoints';
import type { ApiResponse } from '../../types/api';
import type { Attendance, AttendanceStatus } from './attendanceTypes';

export const markAttendance = async (
  staffId: string,
  date: string,
  status: AttendanceStatus,
): Promise<ApiResponse<{ attendance: Attendance }>> => {
  const response = await axiosInstance.put<ApiResponse<{ attendance: Attendance }>>(
    API_ENDPOINTS.STAFF.ATTENDANCE_BY_DATE(staffId, date),
    { status },
  );
  return response.data;
};

interface AttendanceListData {
  attendance: Attendance[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

// No cross-staff attendance endpoint exists — every call is scoped to one
// staff member, so callers fetch this per row instead of in one batch.
export const getAttendanceForDate = async (
  staffId: string,
  date: string,
): Promise<Attendance | null> => {
  const response = await axiosInstance.get<ApiResponse<AttendanceListData>>(
    API_ENDPOINTS.STAFF.ATTENDANCE(staffId),
    { params: { from: date, to: date, page: 1, limit: 1 } },
  );
  return response.data.data.attendance[0] ?? null;
};
