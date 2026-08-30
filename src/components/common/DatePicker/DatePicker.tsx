import React from 'react';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface DatePickerProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

function DatePickerInner<T extends FieldValues>({
  name,
  control,
  label,
  disabled = false,
  minDate,
  maxDate,
}: DatePickerProps<T>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <MuiDatePicker
            label={label}
            value={field.value ? dayjs(field.value as string) : null}
            onChange={(date) => {
              field.onChange(date ? date.toISOString() : null);
            }}
            disabled={disabled}
            minDate={minDate ? dayjs(minDate) : undefined}
            maxDate={maxDate ? dayjs(maxDate) : undefined}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
                size: 'small',
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}

const DatePickerField = React.memo(DatePickerInner) as typeof DatePickerInner;
export default DatePickerField;
