import React from 'react';
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
} from '@mui/material';

/**
 * Shared wrapper for MUI Autocomplete component.
 * Use this component instead of importing directly from \@mui/material.
 *
 * @param props - All props from MUI AutocompleteProps, including:
 * - options: Array of options to display
 * - value: The current selected value(s)
 * - onChange: Callback when selection changes
 * - renderInput: Function to render the input field
 * - disabled: Whether the autocomplete is disabled
 * - multiple: Whether multiple selections are allowed
 * - And all other MUI Autocomplete props
 *
 * @returns JSX.Element - The rendered Autocomplete component
 *
 * @example
 * ```tsx
 * <Autocomplete
 *   options={['Option 1', 'Option 2']}
 *   renderInput={(params) => <TextField {...params} label="Select" />}
 * />
 * ```
 */
export const Autocomplete = <
  T,
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
  TFreeSolo extends boolean | undefined,
>(
  props: AutocompleteProps<T, TMultiple, TDisableClearable, TFreeSolo>,
): JSX.Element => {
  return <MuiAutocomplete {...props} />;
};
