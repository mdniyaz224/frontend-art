// ============================================================
// AttendanceStatusCell — Per-row Attendance Marker
// ============================================================
// Unmarked row: four pastel status pills (matches the design's "pick one"
// row). Marked row: a single solid dark pill showing the current status
// with an edit pencil — clicking it re-opens the four options.

import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useAppDispatch, useAppSelector } from '../../../Store/hooks';
import { selectAttendanceEntry } from '../attendanceSelectors';
import { fetchAttendanceForDate, markAttendanceThunk } from '../attendanceThunk';
import { ATTENDANCE_STATUS_OPTIONS } from '../attendanceTypes';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/constants';

interface AttendanceStatusCellProps {
  staffId: string;
  date: string;
}

const AttendanceStatusCell: React.FC<AttendanceStatusCellProps> = ({ staffId, date }) => {
  const dispatch = useAppDispatch();
  const canMark = usePermission(PERMISSIONS.ATTENDANCE_MARK);
  const entry = useAppSelector((state) => selectAttendanceEntry(state, staffId, date));
  const [editing, setEditing] = useState(false);
  const [editingSyncedFor, setEditingSyncedFor] = useState(date);

  useEffect(() => {
    if (!entry) {
      dispatch(fetchAttendanceForDate({ staffId, date }));
    }
  }, [dispatch, staffId, date, entry]);

  // Collapse back to the read view when the selected date changes —
  // adjusting state during render instead of an effect avoids the extra
  // cascading render.
  if (editingSyncedFor !== date) {
    setEditingSyncedFor(date);
    setEditing(false);
  }

  if (!entry || entry.loading) {
    return <CircularProgress size={18} />;
  }

  const showOptions = !entry.status || editing;

  if (showOptions) {
    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {ATTENDANCE_STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="small"
            disabled={!canMark}
            onClick={() => {
              dispatch(markAttendanceThunk({ staffId, date, status: option.value }));
              setEditing(false);
            }}
            sx={{
              px: 1.75,
              py: 0.5,
              minWidth: 0,
              borderRadius: 999,
              fontWeight: 700,
              bgcolor: option.color,
              color: option.textColor,
              '&:hover': { bgcolor: option.color, opacity: 0.88 },
              '&.Mui-disabled': { bgcolor: option.color, color: option.textColor, opacity: 0.5 },
            }}
          >
            {option.label}
          </Button>
        ))}
      </Box>
    );
  }

  const current = ATTENDANCE_STATUS_OPTIONS.find((o) => o.value === entry.status);

  return (
    <Button
      size="small"
      disabled={!canMark}
      endIcon={<EditRoundedIcon fontSize="small" />}
      onClick={() => setEditing(true)}
      sx={{
        borderRadius: 999,
        bgcolor: 'rgba(255,255,255,0.08)',
        color: '#fff',
        fontWeight: 700,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
      }}
    >
      {current?.label || entry.status}
    </Button>
  );
};

export default React.memo(AttendanceStatusCell);
