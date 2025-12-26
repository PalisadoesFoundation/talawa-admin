import React from 'react';
import { FormCheckBoxProps } from 'types/FormFieldGroup/interface';
import { Form } from 'react-bootstrap';

const FormCheckbox: React.FC<
  FormCheckBoxProps & { children: React.ReactNode }
> = ({
  containerClass,
  labelText,
  labelProps,
  ...checkBoxProps
}) => {
  return (
    <div className={containerClass}>
      <label {...labelProps}>{labelText}?</label>
      <Form.Switch {...checkBoxProps} />
    </div>
  );
};

export default FormCheckbox;
