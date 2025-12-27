import React from 'react';
import { FormControl, TextField } from '@mui/material';
import type { FormTextAreaProps } from './types';

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  endAdornment,
  ...inputProps
}) => {
  return (
    <FormControl>
      <TextField {...inputProps} aria-invalid={inputProps.error} />
      {endAdornment && <>{endAdornment}</>}
    </FormControl>
  );
};
