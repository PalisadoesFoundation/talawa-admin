import React from 'react';
import { Check, Clear } from '@mui/icons-material';

interface IValidationItemProps {
  failed: boolean;
  text: string;
  className?: string;
}

/**
 * ValidationItem Component
 * Displays individual password validation check
 */
const ValidationItem = ({ failed, text, className }: IValidationItemProps) => (
  <p
    className={`form-text ${failed ? 'text-danger' : 'text-success'} ${className || ''}`}
  >
    <span>{failed ? <Clear /> : <Check />}</span>
    {text}
  </p>
);

export default ValidationItem;
