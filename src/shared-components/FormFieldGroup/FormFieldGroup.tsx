import React from 'react';
import { Form } from 'react-bootstrap';
import type { FormFieldGroupProps } from 'types/shared-components/FormFieldGroup/interface';

export const FormFieldGroup: React.FC<
  FormFieldGroupProps & { children: React.ReactNode }
> = ({
  name,
  label,
  children,
  groupClass,
  labelClass,
  error,
  touched,
  required,
  helpText,
}) => {
  const errorId = `${name || 'field'}-error`;
  const shouldShowError = touched && error;

  const childrenWithAria = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;
      const existingDescribedBy = childProps['aria-describedby'] as
        | string
        | undefined;
      const existingInvalid = childProps['aria-invalid'] as string | undefined;

      return React.cloneElement(child, {
        'aria-describedby': shouldShowError ? errorId : existingDescribedBy,
        'aria-invalid': shouldShowError ? 'true' : existingInvalid,
      } as Partial<unknown>);
    }
    return child;
  });

  return (
    <Form.Group className={groupClass}>
      {label && (
        <Form.Label className={labelClass}>
          {label}
          {required && <span aria-label="required">*</span>}
        </Form.Label>
      )}

      {childrenWithAria}

      {shouldShowError && (
        <Form.Control.Feedback
          type="invalid"
          id={errorId}
          style={{ display: 'block' }}
        >
          {error}
        </Form.Control.Feedback>
      )}

      {!shouldShowError && helpText && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}
    </Form.Group>
  );
};
