/*
 *The base wrapper component that combines labels, inputs, error messages, and help text with automatic ARIA attribute injection for accessibility compliance.
 */
import React from 'react';
import { Form } from 'react-bootstrap';
import type { IFormFieldGroupProps } from 'types/shared-components/FormFieldGroup/interface';

export const FormFieldGroup: React.FC<
  IFormFieldGroupProps & { children: React.ReactNode }
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
  const fieldId = name ?? 'field';
  const errorId = `${fieldId}-error`;

  const shouldShowError = touched && error;

  const childrenWithAria = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = child.props as Record<string, unknown>;

      const existingDescribedBy = childProps['aria-describedby'] as
        | string
        | undefined;
      const existingInvalid = childProps['aria-invalid'] as string | undefined;

      const isPositionRelativeWrapper =
        typeof child.type === 'string' &&
        child.type === 'div' &&
        typeof childProps.className === 'string' &&
        childProps.className.includes('position-relative');

      if (isPositionRelativeWrapper && childProps.children) {
        const wrappedChildren = React.Children.map(
          childProps.children as React.ReactNode,
          (nestedChild) => {
            if (React.isValidElement(nestedChild)) {
              const nestedProps = nestedChild.props as Record<string, unknown>;
              if (nestedChild.type && typeof nestedChild.type !== 'string') {
                return React.cloneElement(nestedChild, {
                  id: fieldId,
                  'aria-describedby': shouldShowError
                    ? errorId
                    : nestedProps['aria-describedby'],
                  'aria-invalid': shouldShowError
                    ? 'true'
                    : nestedProps['aria-invalid'],
                } as Partial<unknown>);
              }
            }
            return nestedChild;
          },
        );

        return React.cloneElement(child, {
          children: wrappedChildren,
        } as Partial<unknown>);
      }

      return React.cloneElement(child, {
        id: fieldId,
        'aria-describedby': shouldShowError ? errorId : existingDescribedBy,
        'aria-invalid': shouldShowError ? 'true' : existingInvalid,
      } as Partial<unknown>);
    }
    return child;
  });

  return (
    <Form.Group className={groupClass}>
      {label && (
        <Form.Label className={labelClass} htmlFor={fieldId}>
          {label}
          {required && <span aria-hidden="true">*</span>}
        </Form.Label>
      )}

      {childrenWithAria}

      {shouldShowError && (
        <Form.Control.Feedback type="invalid" id={errorId} className="d-block">
          {error}
        </Form.Control.Feedback>
      )}

      {!shouldShowError && helpText && (
        <Form.Text className="text-muted">{helpText}</Form.Text>
      )}
    </Form.Group>
  );
};
