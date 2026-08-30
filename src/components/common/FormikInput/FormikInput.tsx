import React from 'react';
import { useField } from 'formik';
import { Box, TextField, Typography, type TextFieldProps } from '@mui/material';

type FormikInputProps<T extends object> = {
  name: Extract<keyof T, string>;
  label: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  placeholder?: string;
} & Omit<TextFieldProps, 'name' | 'label' | 'type' | 'value' | 'onChange' | 'onBlur'>;

function FormikInputInner<T extends object>({
  name,
  label,
  type = 'text',
  multiline = false,
  rows,
  disabled = false,
  placeholder,
  ...rest
}: FormikInputProps<T>) {
  const [field, meta, helpers] = useField<string | number | null | undefined>(name);
  const isNumeric = type === 'number';

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isNumeric) {
      const raw = event.target.value;
      helpers.setValue(raw === '' ? '' : Number(raw));
      return;
    }
    field.onChange(event);
  };

  return (
    <Box>
      <Typography component="label" htmlFor={name} variant="body2" sx={{ mb: 0.75, display: 'block', fontWeight: 500 }}>
        {label}
      </Typography>
      <TextField
        {...rest}
        id={name}
        name={name}
        type={type}
        multiline={multiline}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        value={field.value ?? ''}
        onChange={handleChange}
        onBlur={field.onBlur}
        error={meta.touched && !!meta.error}
        helperText={meta.touched && meta.error}
        fullWidth
      />
    </Box>
  );
}

const FormikInput = React.memo(FormikInputInner) as unknown as typeof FormikInputInner;
export default FormikInput;
