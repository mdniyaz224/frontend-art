import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { TextField, type TextFieldProps } from '@mui/material';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
} & Omit<TextFieldProps, 'name' | 'label' | 'type'>;

function FormInputInner<T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  multiline = false,
  rows,
  disabled = false,
  placeholder,
  ...rest
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          type={type}
          multiline={multiline}
          rows={rows}
          disabled={disabled}
          placeholder={placeholder}
          error={!!error}
          helperText={error?.message}
          fullWidth
          value={field.value ?? ''}
        />
      )}
    />
  );
}

const FormInput = React.memo(FormInputInner) as typeof FormInputInner;
export default FormInput;
