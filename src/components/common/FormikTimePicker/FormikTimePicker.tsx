// ============================================================
// FormikTimePicker — MUI TimePicker bound to a Formik field
// ============================================================
// Stores the value as a plain "HH:mm" 24-hour string, matching be-boiler's
// shiftStart/shiftEnd validation (TIME_HHMM_REGEX in staff.validator.ts).
// Renders a static label above a plain (non-floating) time field, matching
// the Add/Edit Staff design — not Material's default notched floating label.

import React from 'react';
import { useField } from 'formik';
import { Box, Typography } from '@mui/material';
import { TimePicker as MuiTimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface FormikTimePickerProps<T extends object> {
  name: Extract<keyof T, string>;
  label: string;
  disabled?: boolean;
  placeholder?: string;
}

function FormikTimePickerInner<T extends object>({
  name,
  label,
  disabled = false,
  placeholder = 'Enter timing',
}: FormikTimePickerProps<T>) {
  const [field, meta, helpers] = useField<string | null>(name);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography component="label" htmlFor={name} variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
          {label}
        </Typography>
        <MuiTimePicker
          value={field.value ? dayjs(field.value, 'HH:mm') : null}
          onChange={(time) => helpers.setValue(time ? time.format('HH:mm') : null)}
          disabled={disabled}
          ampm
          slotProps={{
            textField: {
              id: name,
              fullWidth: true,
              placeholder,
              onBlur: field.onBlur,
              error: meta.touched && !!meta.error,
              helperText: meta.touched && meta.error,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

const FormikTimePicker = React.memo(FormikTimePickerInner) as unknown as typeof FormikTimePickerInner;
export default FormikTimePicker;
