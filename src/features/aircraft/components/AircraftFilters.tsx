// ============================================================
// AircraftFilters — Filter Bar for Aircraft List
// ============================================================

import React from 'react';
import { Box, TextField, MenuItem, InputAdornment } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import type { AircraftFilter } from '../aircraftTypes';
import { AIRCRAFT_STATUS_OPTIONS } from '../aircraftTypes';

interface AircraftFiltersProps {
  filters: AircraftFilter;
  onChange: (filters: AircraftFilter) => void;
}

const AircraftFilters: React.FC<AircraftFiltersProps> = ({ filters, onChange }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: event.target.value });
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, status: event.target.value as AircraftFilter['status'] });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        mb: 3,
      }}
    >
      <TextField
        placeholder="Search aircraft..."
        value={filters.search || ''}
        onChange={handleSearchChange}
        size="small"
        sx={{ minWidth: 260 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        select
        label="Status"
        value={filters.status || ''}
        onChange={handleStatusChange}
        size="small"
        sx={{ minWidth: 180 }}
      >
        <MenuItem value="">All Statuses</MenuItem>
        {AIRCRAFT_STATUS_OPTIONS.map((status) => (
          <MenuItem key={status.value} value={status.value}>
            {status.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default React.memo(AircraftFilters);
