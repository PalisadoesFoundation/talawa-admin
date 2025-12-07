import React from 'react';
import { Check, Clear } from '@mui/icons-material';
import { InterfaceValidationItemProps } from 'types/PasswordValidator/interface';
/**
 * ValidationItem
 * Displays a single password validation requirement with check/clear icon.
 * @param {InterfaceValidationItemProps} props
 * @param {boolean} props.isValid
 * @param {string} props.text
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
const ValidationItem = ({
  isValid,
  text,
  className,
}: InterfaceValidationItemProps) => (
  <p
    className={`form-text ${isValid ? 'text-success' : 'text-danger'} ${className || ''}`}
    data-testid="validation-item"
  >
    <span>{isValid ? <Check /> : <Clear />}</span>
    {text}
  </p>
);

export default ValidationItem;
