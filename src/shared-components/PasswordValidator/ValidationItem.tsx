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
const ValidationItem: React.FC<IValidationItemProps> = ({
  isValid,
  text,
  className,
}) => (
  <p
    className={`form-text ${isValid ? 'text-danger' : 'text-success'} ${className || ''}`}
  >
    <span>{isValid ? <Clear /> : <Check />}</span>
    {text}
  </p>
);

export default ValidationItem;
