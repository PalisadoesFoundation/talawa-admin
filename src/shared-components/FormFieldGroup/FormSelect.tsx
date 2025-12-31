import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { IFormSelectProps } from 'types/shared-components/FormFieldGroup/interface';

export const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  label,
  error,
  touched,
  helpText,
  required,
  disabled,
  className,
  options,
  value,
  multiple,
  limitTags,
  isOptionEqualToValue,
  filterSelectedOptions,
  getOptionLabel,
  onChange,
  renderInput,
  ...dataAttributes
}) => {
  const showError = !!(touched && error);
  const errorMessage = showError ? String(error) : '';

  return (
    <Autocomplete
      options={options || []}
      value={value}
      multiple={multiple}
      limitTags={limitTags}
      isOptionEqualToValue={isOptionEqualToValue}
      filterSelectedOptions={filterSelectedOptions}
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      disabled={disabled}
      className={className}
      renderInput={
        renderInput ??
        ((params) => (
          <TextField
            {...params}
            name={name}
            label={label}
            error={showError}
            helperText={errorMessage || helpText}
            required={required}
          />
        ))
      }
      {...dataAttributes}
    />
  );
};
