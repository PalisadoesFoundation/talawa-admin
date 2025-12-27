import React from 'react';
import { FormRadioGroupProps } from './types';
import { Form } from 'react-bootstrap';

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  error,
  touched,
  ...radioGroupProps
}) => {
  return (
    <>
      <Form.Check
        {...radioGroupProps}
        label={label}
        isInvalid={!!(touched && error)}
      />
      {touched && error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </>
  );
};
