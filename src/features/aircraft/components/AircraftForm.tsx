// ============================================================
// AircraftForm — Create/Edit Aircraft Form
// ============================================================

import React from 'react';
import { Box, Grid, Button, CircularProgress, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../../components/common/FormInput/FormInput';
import FormSelect from '../../../components/common/FormSelect/FormSelect';
import DatePickerField from '../../../components/common/DatePicker/DatePicker';
import type { AircraftFormValues, AircraftStatus } from '../aircraftTypes';
import { AIRCRAFT_STATUS_OPTIONS } from '../aircraftTypes';
import type { SelectOption } from '../../../types/common';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

const aircraftSchema = yup.object({
  registrationNumber: yup.string().required('Registration number is required'),
  model: yup.string().required('Model is required'),
  manufacturer: yup.string().required('Manufacturer is required'),
  serialNumber: yup.string().required('Serial number is required'),
  status: yup
    .mixed<AircraftStatus>()
    .oneOf(['ACTIVE', 'IN_MAINTENANCE', 'GROUNDED', 'RETIRED', 'IN_SERVICE'])
    .required('Status is required'),
  yearOfManufacture: yup
    .number()
    .typeError('Year is required')
    .min(1900, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future')
    .required('Year of manufacture is required'),
  totalFlightHours: yup
    .number()
    .typeError('Flight hours must be a number')
    .min(0, 'Flight hours cannot be negative')
    .required('Total flight hours is required'),
  capacity: yup
    .number()
    .typeError('Capacity must be a number')
    .min(1, 'Capacity must be at least 1')
    .required('Capacity is required'),
  engineType: yup.string().required('Engine type is required'),
  lastMaintenanceDate: yup.string().nullable().defined(),
  nextMaintenanceDate: yup.string().nullable().defined(),
  notes: yup.string().optional(),
});

interface AircraftFormProps {
  defaultValues?: Partial<AircraftFormValues>;
  onSubmit: (data: AircraftFormValues) => void;
  loading?: boolean;
  submitLabel?: string;
}

const AircraftForm: React.FC<AircraftFormProps> = ({
  defaultValues,
  onSubmit,
  loading = false,
  submitLabel = 'Save Aircraft',
}) => {
  const { control, handleSubmit } = useForm<AircraftFormValues>({
    resolver: yupResolver(aircraftSchema),
    defaultValues: {
      registrationNumber: '',
      model: '',
      manufacturer: '',
      serialNumber: '',
      status: 'ACTIVE',
      yearOfManufacture: new Date().getFullYear(),
      totalFlightHours: 0,
      capacity: 1,
      engineType: '',
      lastMaintenanceDate: null,
      nextMaintenanceDate: null,
      notes: '',
      ...defaultValues,
    },
  });

  const statusOptions: SelectOption[] = AIRCRAFT_STATUS_OPTIONS.map((s) => ({
    label: s.label,
    value: s.value,
  }));

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* General Information Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ width: 4, height: 16, bgcolor: 'primary.main', borderRadius: 1 }} />
          General Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormInput name="registrationNumber" control={control} label="Registration Number" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInput name="serialNumber" control={control} label="Serial Number" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInput name="model" control={control} label="Model" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormInput name="manufacturer" control={control} label="Manufacturer" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormInput name="yearOfManufacture" control={control} label="Year of Manufacture" type="number" disabled={loading} />
          </Grid>
        </Grid>
      </Box>

      {/* Technical Specifications Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'info.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ width: 4, height: 16, bgcolor: 'info.main', borderRadius: 1 }} />
          Technical Specifications
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <FormInput name="engineType" control={control} label="Engine Type" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormInput name="capacity" control={control} label="Passenger Capacity" type="number" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormInput name="totalFlightHours" control={control} label="Total Flight Hours" type="number" disabled={loading} />
          </Grid>
        </Grid>
      </Box>

      {/* Status & Maintenance Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'warning.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ width: 4, height: 16, bgcolor: 'warning.main', borderRadius: 1 }} />
          Status & Maintenance
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormSelect name="status" control={control} label="Current Status" options={statusOptions} disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePickerField name="lastMaintenanceDate" control={control} label="Last Maintenance Date" disabled={loading} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePickerField name="nextMaintenanceDate" control={control} label="Next Maintenance Date" disabled={loading} />
          </Grid>
          <Grid item xs={12}>
            <FormInput name="notes" control={control} label="Additional Notes" multiline rows={3} disabled={loading} />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveRoundedIcon />}
          sx={{ minWidth: 180 }}
        >
          {submitLabel}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(AircraftForm);
