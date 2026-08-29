// ============================================================
// StaffNameCell — Avatar + Name + Role, shared by Staff & Attendance tables
// ============================================================

import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { getInitials, capitalize } from '../../../utils/formatters';
import type { Staff } from '../staffTypes';

interface StaffNameCellProps {
  staff: Staff;
}

const StaffNameCell: React.FC<StaffNameCellProps> = ({ staff }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar src={staff.profilePicture} sx={{ width: 36, height: 36, fontSize: '0.8rem', fontWeight: 600 }}>
      {getInitials(staff.name)}
    </Avatar>
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {staff.name}
      </Typography>
      <Typography variant="caption" sx={{ color: 'secondary.light' }}>
        {capitalize(staff.role)}
      </Typography>
    </Box>
  </Box>
);

export default React.memo(StaffNameCell);
