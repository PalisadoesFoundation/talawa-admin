import React from 'react';
// eslint-disable-next-line no-restricted-imports -- This component wraps MUI TextField to provide a shared implementation
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

/**
 * Shared wrapper for MUI TextField component.
 * Use this component instead of importing directly from \@mui/material.
 */
export const TextField = (props: TextFieldProps): JSX.Element => {
  return <MuiTextField {...props} />;
};
