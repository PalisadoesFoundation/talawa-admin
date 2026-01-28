import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

/**
 * Shared wrapper for MUI TextField component.
 * Use this component instead of importing directly from \@mui/material.
 */
export const TextField = (props: TextFieldProps): JSX.Element => {
  return <MuiTextField {...props} />;
};
