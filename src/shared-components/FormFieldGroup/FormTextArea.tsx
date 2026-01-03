import React from 'react';
import { FormControl, TextField } from '@mui/material';
import type { IFormTextAreaProps } from 'types/shared-components/FormFieldGroup/interface';

export const FormTextArea: React.FC<IFormTextAreaProps> = ({
  label,
  error,
  touched,
  helpText,
  required,
  ariaLabel,
  endAdornment,
  rows,
  ...inputProps
}) => {
  const showError = !!(touched && error);
  const errorMessage = showError && typeof error === 'string' ? error : '';

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
        slotProps={{
          input: {
            endAdornment
          },
        }}
        aria-label={ariaLabel}
        aria-invalid={showError}
      />
    </FormControl>
  );
};
