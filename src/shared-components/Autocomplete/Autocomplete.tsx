import React from 'react';
// eslint-disable-next-line no-restricted-imports -- This component wraps MUI Autocomplete to provide a shared implementation
import {
  Autocomplete as MuiAutocomplete,
  AutocompleteProps,
} from '@mui/material';

/**
 * Shared wrapper for MUI Autocomplete component.
 * Use this component instead of importing directly from \@mui/material.
 */
export const Autocomplete = <
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(
  props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
): JSX.Element => {
  return <MuiAutocomplete {...props} />;
};
