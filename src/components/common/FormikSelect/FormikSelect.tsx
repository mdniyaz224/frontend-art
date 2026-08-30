import React from 'react';
import { useField } from 'formik';
import { Box, TextField, MenuItem, Typography } from '@mui/material';
import type { SelectOption } from '../../../types/common';

interface FormikSelectProps<T extends object> {
  name: Extract<keyof T, string>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}

function FormikSelectInner<T extends object>({
  name,
  label,
  options,
  disabled = false,
  placeholder,
  fullWidth = true,
}: FormikSelectProps<T>) {
  const [field, meta] = useField<string>(name);

  return (
    <Box>
      <Typography component="label" htmlFor={name} variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
        {label}
      </Typography>
      <TextField
        {...field}
        id={name}
        select
        disabled={disabled}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        fullWidth={fullWidth}
        value={field.value ?? ''}
        slotProps={{
          select: {
            displayEmpty: true,
            renderValue: (value) =>
              value ? options.find((o) => o.value === value)?.label : (
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {placeholder || 'Select an option'}
                </Box>
              ),
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}

const FormikSelect = React.memo(FormikSelectInner) as unknown as typeof FormikSelectInner;
export default FormikSelect;
