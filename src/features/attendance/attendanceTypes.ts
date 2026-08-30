export type AttendanceStatus = 'present' | 'absent' | 'half_shift' | 'leave';

export interface Attendance {
  id: string;
  staff: string;
  date: string;
  status: AttendanceStatus;
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export const ATTENDANCE_STATUS_OPTIONS: {
  label: string;
  value: AttendanceStatus;
  color: string;
  textColor: string;
}[] = [
  { label: 'Present', value: 'present', color: '#f9a8d4', textColor: '#1a1625' },
  { label: 'Absent', value: 'absent', color: '#fde68a', textColor: '#1a1625' },
  { label: 'Half Shift', value: 'half_shift', color: '#bae6fd', textColor: '#1a1625' },
  { label: 'Leave', value: 'leave', color: '#fca5a5', textColor: '#1a1625' },
];

export type AttendanceKey = string;

export const attendanceKey = (staffId: string, date: string): AttendanceKey => `${staffId}::${date}`;

export interface AttendanceEntryState {
  status: AttendanceStatus | null;
  loading: boolean;
  error: string | null;
}

export interface AttendanceState {
  entries: Record<AttendanceKey, AttendanceEntryState>;
}
