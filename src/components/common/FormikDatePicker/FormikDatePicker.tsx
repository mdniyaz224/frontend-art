import React from 'react';
import { useField } from 'formik';
import { Box, Typography } from '@mui/material';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface FormikDatePickerProps<T extends object> {
  name: Extract<keyof T, string>;
  label: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  placeholder?: string;
}

function FormikDatePickerInner<T extends object>({
  name,
  label,
  disabled = false,
  minDate,
  maxDate,
  placeholder = 'Enter date',
}: FormikDatePickerProps<T>) {
  const [field, meta, helpers] = useField<string | null>(name);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography component="label" htmlFor={name} variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
          {label}
        </Typography>
        <MuiDatePicker
          value={field.value ? dayjs(field.value) : null}
          onChange={(date) => helpers.setValue(date ? date.toISOString() : null)}
          disabled={disabled}
          minDate={minDate ? dayjs(minDate) : undefined}
          maxDate={maxDate ? dayjs(maxDate) : undefined}
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

const FormikDatePicker = React.memo(FormikDatePickerInner) as unknown as typeof FormikDatePickerInner;
export default FormikDatePicker;
