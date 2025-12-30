import React from 'react';
import { Form } from 'react-bootstrap';
import { FormControl, TextField } from '@mui/material';
import type { FormTextFieldProps } from 'types/shared-components/FormFieldGroup/interface';
import { FormFieldGroup } from './FormFieldGroup';

export const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  label,
  groupClass,
  labelClass,
  error,
  touched,
  helpText,
  required,
  ariaLabel,
  ariaDescribedBy,
  showCharCount,
  endAdornment,
  format,
  ...formControlProps
}) => {
  if (format === 'mui') {
    return (
      <FormControl>
        <TextField
          {...formControlProps}
          name={name}
          label={label}
          error={!!(touched && error)}
          helperText={touched && error ? error : helpText}
          required={required}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          slotProps={{
            input: {
              endAdornment: endAdornment,
            },
          }}
        />
      </FormControl>
    );
  }

  return (
    <FormFieldGroup
      name={name}
      label={label}
      groupClass={groupClass}
      labelClass={labelClass}
      error={error}
      touched={touched}
      helpText={helpText}
      required={required}
    >
      <div className="position-relative">
        <Form.Control
          {...formControlProps}
          required={required}
          isInvalid={!!(touched && error)}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
        />
        {endAdornment && <>{endAdornment}</>}
        {showCharCount && formControlProps.maxLength && (
          <Form.Text className="text-muted">
            {String(formControlProps.value ?? '').length}/
            {formControlProps.maxLength}
          </Form.Text>
        )}
      </div>
    </FormFieldGroup>
  );
};
