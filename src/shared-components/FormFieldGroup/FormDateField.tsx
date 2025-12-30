import React from 'react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormDateFieldProps } from 'types/shared-components/FormFieldGroup/interface';
export const FormDateField: React.FC<FormDateFieldProps> = ({
  value,
  onChange,
  format = 'YYYY-MM-DD',
  maxDate,
  minDate,
  className,
  label,
  slotProps,
  ...datePickerProps
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format={format}
        value={value}
        onChange={onChange}
        className={className}
        label={label}
        maxDate={maxDate}
        minDate={minDate}
        slotProps={slotProps}
        {...datePickerProps}
      />
    </LocalizationProvider>
  );
};
