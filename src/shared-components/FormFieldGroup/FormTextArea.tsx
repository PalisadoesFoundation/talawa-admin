import React from 'react';
import { FormControl, TextField } from '@mui/material';
import type { IFormTextAreaProps } from 'types/shared-components/FormFieldGroup/interface';

export const FormTextArea: React.FC<IFormTextAreaProps> = ({
  name,
  label,
  error,
  touched,
  helpText,
  required,
  ariaLabel,
  ariaDescribedBy,
  endAdornment,
  rows,
  ...inputProps
}) => {
  const showError = !!(touched && error);
  const errorMessage = showError ? String(error) : '';

  return (
    <FormControl fullWidth error={showError}>
      <TextField
        {...inputProps}
        label={label}
        multiline
        rows={rows}
        error={showError}
        helperText={errorMessage || helpText}
        required={required}
        InputProps={{
          endAdornment: endAdornment,
        }}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={showError}
      />
    </FormControl>
  );
};
