// ============================================================
// FormSelect — MUI Select with React Hook Form Controller
// ============================================================

import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';
import type { SelectOption } from '../../../types/common';

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: SelectOption[];
  disabled?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}

function FormSelectInner<T extends FieldValues>({
  name,
  control,
  label,
  options,
  disabled = false,
  placeholder,
  fullWidth = true,
}: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          label={label}
          disabled={disabled}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          fullWidth={fullWidth}
          value={field.value ?? ''}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

const FormSelect = React.memo(FormSelectInner) as typeof FormSelectInner;
export default FormSelect;
