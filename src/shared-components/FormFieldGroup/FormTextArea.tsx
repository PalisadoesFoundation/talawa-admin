import React from 'react';
import { FormControl, TextField } from '@mui/material';
import type { FormTextAreaProps } from '../../types/FormFieldGroup/interface';

const FormTextArea: React.FC<FormTextAreaProps> = ({
  endAdornment,
  ...inputProps
}) => {
  return (
    <FormControl>
      <TextField {...inputProps} />
      {endAdornment && <>{endAdornment}</>}
    </FormControl>
  );
};

export default FormTextArea;
