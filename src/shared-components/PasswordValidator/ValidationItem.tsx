import React from 'react';
import { Check, Clear } from '@mui/icons-material';

interface IValidationItemProps {
  isValid: boolean;
  text: string;
  className?: string;
}

/**
 * ValidationItem Component
 * Displays individual password validation check
 */
const ValidationItem = ({ isValid, text, className }: IValidationItemProps) => (
  <p
    className={`form-text ${isValid ? 'text-success' : 'text-danger'} ${className || ''}`}
    data-testid="validation-item"
  >
    <span>{isValid ? <Check /> : <Clear />}</span>
    {text}
  </p>
);

export default ValidationItem;
