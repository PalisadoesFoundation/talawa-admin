import React from 'react';
import { FormCheckBoxProps } from './types';
import { Form } from 'react-bootstrap';

export const FormCheckbox: React.FC<FormCheckBoxProps> = ({
  containerClass,
  labelText,
  error,
  touched,
  id,
  ...checkBoxProps
}) => {
  return (
    <div className={containerClass}>
      <Form.Check 
        {...checkBoxProps}
        id={id}
        type="checkbox"
        label={labelText}
        isInvalid={!!(touched && error)}
      />
      {touched && error && (
        <Form.Control.Feedback type="invalid" className="d-block">
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};
