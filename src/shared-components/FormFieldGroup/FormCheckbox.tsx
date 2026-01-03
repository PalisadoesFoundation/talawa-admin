import React from 'react';
import { IFormCheckBoxProps } from 'types/shared-components/FormFieldGroup/interface';
import { Form } from 'react-bootstrap';

export const FormCheckbox: React.FC<IFormCheckBoxProps> = ({
  containerClass,
  labelText,
  error,
  touched,
  id,
  ...checkBoxProps
}) => {
  const errorId = `${id}-error`;
  return (
    <div className={containerClass}>
      <Form.Check
        {...checkBoxProps}
        id={id}
        type="checkbox"
        label={labelText}
        isInvalid={!!(touched && error)}
        aria-describedby={touched && error ? errorId : undefined}
      />
      {touched && error && (
        <Form.Control.Feedback type="invalid" className="d-block" id={errorId}>
          {error}
        </Form.Control.Feedback>
      )}
    </div>
  );
};
