import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { InterfacePasswordFieldProps } from 'types/PasswordField/interface';
import styles from 'style/app-fixed.module.css';

/**
 * PasswordField Component
 *
 * Reusable password input field with show/hide toggle
 *
 * @param {InterfacePasswordFieldProps} props - Component props
 * @returns {JSX.Element} The rendered password field
 *
 * @example
 * <PasswordField
 *   label="Password"
 *   value={password}
 *   onChange={setPassword}
 * />
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
