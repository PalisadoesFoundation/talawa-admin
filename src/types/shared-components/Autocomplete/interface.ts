import {
  AutocompleteFreeSoloValueMapping,
  AutocompleteValue,
  AutocompleteProps as MuiAutocompleteProps,
  TextFieldProps as MuiTextFieldProps,
  AutocompleteRenderInputParams,
} from '@mui/material';
import React from 'react';

/**
 * Props for the shared Autocomplete component.
 *
 * This interface extends the MUI Autocomplete props while providing custom
 * props for consistent behavior, accessibility, and integration patterns
 * across the application.
 *
 * @typeParam T - The type of the option object
 * @typeParam TMultiple - Whether multiple selection is enabled (default: false)
 * @typeParam TDisableClearable - Whether clearing the value is disabled (default: false)
 * @typeParam TFreeSolo - Whether free-form user input is allowed (default: false)
 */
export interface IAutocompleteProps<
  T,
  TMultiple extends boolean = false,
  TDisableClearable extends boolean = false,
  TFreeSolo extends boolean = false,
  // i18n-ignore-next-line
> extends Partial<
  Omit<
    MuiAutocompleteProps<T, TMultiple, TDisableClearable, TFreeSolo>,
    | 'id'
    | 'options'
    | 'value'
    | 'onChange'
    | 'getOptionLabel'
    | 'isOptionEqualToValue'
    | 'multiple'
    | 'disableClearable'
    | 'freeSolo'
    | 'disabled'
    | 'loading'
    | 'fullWidth'
    | 'renderInput'
    | 'className'
  >
> {
  id: string;
  options: T[];

  value: AutocompleteValue<T, TMultiple, TDisableClearable, TFreeSolo>;

  onChange: (
    value: AutocompleteValue<T, TMultiple, TDisableClearable, TFreeSolo>,
  ) => void;

  label?: string;
  placeholder?: string;
  getOptionLabel?: (
    option: T | AutocompleteFreeSoloValueMapping<TFreeSolo>,
  ) => string;

  isOptionEqualToValue?: (option: T, value: T) => boolean;

  multiple?: TMultiple;
  disableClearable?: TDisableClearable;
  freeSolo?: TFreeSolo;

  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;

  fullWidth?: boolean;
  className?: string;
  dataTestId?: string;

  /**
   * Props to customize the underlying TextField component.
   * Allows control over size, variant, InputProps, etc.
   * Note: label, placeholder, error, helperText should be set via top-level props.
   *
   * **Precedence:** If `renderInput` is provided, it fully overrides the default
   * TextField rendering and `textFieldProps` are ignored. If `renderInput` is not
   * provided, `textFieldProps` are merged into the default TextField internally.
   */
  textFieldProps?: Partial<
    Omit<MuiTextFieldProps, 'label' | 'placeholder' | 'error' | 'helperText'>
  >;

  /**
   * Optional custom renderInput function to override how the input is rendered.
   * Takes precedence over the default TextField rendering and textFieldProps.
   * If provided, textFieldProps are ignored.
   */
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;
}
