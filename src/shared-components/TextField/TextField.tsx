import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

/**
 * Shared wrapper for MUI TextField component.
 * Use this component instead of importing directly from \@mui/material.
 *
 * @param props - All props from MUI TextFieldProps, including:
 * - label: The label text for the field
 * - value: The current value of the input
 * - onChange: Callback when the value changes
 * - disabled: Whether the field is disabled
 * - error: Whether the field is in an error state
 * - helperText: Helper text to display below the field
 * - required: Whether the field is required
 * - And all other MUI TextField props
 *
 * @returns JSX.Element - The rendered TextField component
 *
 * @example
 * ```tsx
 * <TextField
 *   label="Username"
 *   value={username}
 *   onChange={(e) => setUsername(e.target.value)}
 * />
 * ```
 */
export const TextField = (props: TextFieldProps): JSX.Element => {
  return <MuiTextField {...props} />;
};
