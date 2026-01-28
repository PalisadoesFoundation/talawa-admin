import React from 'react';
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
  TMultiple extends boolean | undefined,
  TDisableClearable extends boolean | undefined,
  TFreeSolo extends boolean | undefined,
>(
  props: AutocompleteProps<T, TMultiple, TDisableClearable, TFreeSolo>,
): JSX.Element => {
  return <MuiAutocomplete {...props} />;
};
