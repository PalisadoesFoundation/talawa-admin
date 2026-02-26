import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete as MuiAutocomplete,
  TextField,
  CircularProgress,
  AutocompleteValue,
  AutocompleteRenderInputParams,
} from '@mui/material';

import type { IAutocompleteProps } from 'types/shared-components/Autocomplete/interface';

/**
 * Shared Autocomplete Component
 *
 * This component standardizes behavior, accessibility, and integration patterns
 * across the application while preserving full support for generics and advanced
 * selection modes.
 *
 * Supports:
 * - Single and multiple selection modes
 * - Free solo input (custom user input)
 * - Disable clearable mode
 * - Loading and error states
 * - Custom TextField rendering via renderInput prop
 * - TextFieldProps customization
 *
 * The component intentionally controls the underlying TextField rendering to
 * ensure design system consistency and accessibility compliance.
 *
 * Type parameters:
 * - T: The type of the option object
 * - Multiple: Whether multiple selection is enabled (default: false)
 * - DisableClearable: Whether clearing the value is disabled (default: false)
 * - FreeSolo: Whether free-form user input is allowed (default: false)
 *
 * @example
 * ```tsx
 * // Single selection
 * <Autocomplete<User>
 *   id="user-select"
 *   options={users}
 *   value={selectedUser}
 *   onChange={setSelectedUser}
 *   label="Select a user"
 *   getOptionLabel={(user) => user.name}
 * />
 *
 * // Multiple selection
 * <Autocomplete<User, true>
 *   id="user-select"
 *   options={users}
 *   value={selectedUsers}
 *   onChange={setSelectedUsers}
 *   multiple
 *   label="Select users"
 *   getOptionLabel={(user) => user.name}
 * />
 * ```
 *
 * @remarks
 * - This component is part of the shared design system
 * - See {@link IAutocompleteProps} for full prop documentation
 */

export const Autocomplete = <
  T,
  TMultiple extends boolean = false,
  TDisableClearable extends boolean = false,
  TFreeSolo extends boolean = false,
>(
  props: IAutocompleteProps<T, TMultiple, TDisableClearable, TFreeSolo>,
): React.ReactElement => {
  const { t } = useTranslation('common');

  const {
    id,
    options,
    value,
    onChange,
    label,
    placeholder = `${t('select')} ${t('options')}`,

    getOptionLabel,
    isOptionEqualToValue,

    multiple,
    disableClearable,
    freeSolo,

    disabled = false,
    loading = false,
    error = false,
    helperText,

    fullWidth = true,
    className,
    dataTestId = 'shared-autocomplete',
    textFieldProps,
    renderInput: customRenderInput,

    // Capture all remaining MUI Autocomplete props
    ...restAutocompleteProps
  } = props;

  const hasWarnedRef = React.useRef(false);

  // Memoize the getOptionLabel function to ensure warning is only logged once per component instance
  const memoizedGetOptionLabel = React.useCallback(
    (option: T | string): string => {
      if (
        process.env.NODE_ENV === 'development' &&
        !hasWarnedRef.current &&
        option !== null &&
        typeof option === 'object'
      ) {
        hasWarnedRef.current = true;
        console.warn(
          'Autocomplete: getOptionLabel is not provided for object options. Please provide getOptionLabel prop.',
        );
      }
      return typeof option === 'string' ? option : String(option);
    },
    [],
  );

  // Default renderInput using TextField
  const defaultRenderInput = (params: AutocompleteRenderInputParams) => {
    const { InputProps: paramsInputProps, ...restParams } = params;
    const { InputProps: tfInputProps, ...restTextFieldProps } =
      textFieldProps ?? {};
    return (
      <TextField
        {...restParams}
        {...restTextFieldProps}
        label={label}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        data-testid={`${dataTestId}-input`}
        slotProps={{
          input: {
            ...paramsInputProps,
            ...tfInputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {paramsInputProps.endAdornment}
                {tfInputProps?.endAdornment}
              </>
            ),
          },
        }}
      />
    );
  };

  return (
    <MuiAutocomplete<T, TMultiple, TDisableClearable, TFreeSolo>
      id={id}
      options={options}
      value={value}
      multiple={multiple}
      disableClearable={disableClearable}
      freeSolo={freeSolo}
      disabled={disabled}
      loading={loading}
      fullWidth={fullWidth}
      className={className}
      data-testid={dataTestId}
      getOptionLabel={getOptionLabel ?? memoizedGetOptionLabel}
      isOptionEqualToValue={
        isOptionEqualToValue ?? ((option, val) => option === val)
      }
      onChange={(_, newValue) => {
        onChange(
          newValue as AutocompleteValue<
            T,
            TMultiple,
            TDisableClearable,
            TFreeSolo
          >,
        );
      }}
      renderInput={customRenderInput ?? defaultRenderInput}
      // Spread all remaining MUI Autocomplete props
      {...restAutocompleteProps}
    />
  );
};
