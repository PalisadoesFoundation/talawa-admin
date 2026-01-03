import React from 'react';
import { IFormRadioGroupProps } from 'types/shared-components/FormFieldGroup/interface';
import { Form } from 'react-bootstrap';
import { FormFieldGroup } from './FormFieldGroup';

export const FormRadioGroup: React.FC<IFormRadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  error,
  touched,
  required,
  groupClass,
  labelClass,
}) => {
  return (
    <FormFieldGroup
      name={name}
      label={label}
      error={error}
      touched={touched}
      required={required}
      groupClass={groupClass}
      labelClass={labelClass}
    >
      {options.map((option) => (
        <Form.Check
          key={option.value}
          type="radio"
          id={`${name}-${option.value}`}
          name={name}
          label={option.label}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          isInvalid={!!(touched && error)}
        />
      ))}
    </FormFieldGroup>
  );
};
