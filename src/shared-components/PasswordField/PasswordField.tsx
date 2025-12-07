import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { InterfacePasswordFieldProps } from 'types/PasswordField/interface';
import styles from 'style/app-fixed.module.css';

/**
 * PasswordField
 * Reusable password input field with visibility toggle (show/hide).
 * @param {InterfacePasswordFieldProps} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.placeholder='']
 * @param {Function} [props.onFocus]
 * @param {Function} [props.onBlur]
 * @param {string} [props.testId='passwordField']
 * @param {string} [props.autoComplete='current-password']
 * @returns {JSX.Element}
 */
const PasswordField: React.FC<InterfacePasswordFieldProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = '',
  onFocus,
  onBlur,
  testId = 'passwordField',
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = (): void => setShowPassword(!showPassword);

  return (
    <div>
      <Form.Label>{label}</Form.Label>
      <div className="position-relative">
        <Form.Control
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          required
          value={value}
          onChange={(e): void => onChange(e.target.value)}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          data-testid={testId}
        />
        <Button
          onClick={togglePassword}
          data-testid={`${testId}-toggle`}
          className={styles.email_button}
          tabIndex={-1}
        >
          {showPassword ? (
            <i className="fas fa-eye"></i>
          ) : (
            <i className="fas fa-eye-slash"></i>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PasswordField;
