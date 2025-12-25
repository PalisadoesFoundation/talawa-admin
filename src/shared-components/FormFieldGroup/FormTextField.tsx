import React from 'react';
import { Form } from 'react-bootstrap';
import { FormControl, TextField } from '@mui/material';
import type { FormTextFieldProps } from '../../types/FormFieldGroup/interface';

export const FormTextField: React.FC<FormTextFieldProps> = ({
  endAdornment,
  format,
  ...inputProps
}) => {
  if(format==="mui"){
    return(
      <FormControl>
        <TextField {...inputProps}/>
        {endAdornment && <>{endAdornment}</>}
      </FormControl>
    )
  }
  return (
    <div className="position-relative">
      <Form.Control {...inputProps} />
      {endAdornment && <>{endAdornment}</>}
    </div>
  );
};
