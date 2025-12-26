import { Autocomplete } from '@mui/material';
import React from 'react';
import { Form } from 'react-bootstrap';
import { FormSelectProps } from '../../types/FormFieldGroup/interface';

const FormSelect: React.FC<FormSelectProps> = ({
  // FormFieldGroupProps
  groupClass,

  // CommonInputProps
  disabled,
  className,
  
  // Autocomplete-specific props
  options,
  value,
  multiple,
  limitTags,
  isOptionEqualToValue,
  filterSelectedOptions,
  getOptionLabel,
  onChange,
  renderInput,
  
  // Data attributes
  ...dataAttributes
}) => {
  return (
    <Form.Group className={groupClass}>
      <Autocomplete
        className={className}
        multiple={multiple}
        limitTags={limitTags}
        options={options || []}
        value={value}
        disabled={disabled}
        isOptionEqualToValue={isOptionEqualToValue}
        filterSelectedOptions={filterSelectedOptions}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        renderInput={renderInput}
        {...dataAttributes}
      />
    </Form.Group>
  );
};

export default FormSelect;
