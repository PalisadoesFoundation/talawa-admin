import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { FormField } from './FormField';
import userEvent from '@testing-library/user-event';

describe('FormField', () => {
  const defaultProps = {
    name: 'testField',
    value: '',
    onChange: vi.fn(),
  };

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders input with name attribute', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'testField');
    });

    test('renders with label when provided', () => {
      render(<FormField {...defaultProps} label="Test Label" />);

      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
    });

    test('does not render label when not provided', () => {
      render(<FormField {...defaultProps} />);

      expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
    });

    test('renders required indicator when required is true', () => {
      render(<FormField {...defaultProps} label="Required Field" required />);

      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });

    test('renders with placeholder', () => {
      render(<FormField {...defaultProps} placeholder="Enter value" />);

      const input = screen.getByPlaceholderText('Enter value');
      expect(input).toBeInTheDocument();
    });

    test('renders with correct input type', () => {
      render(<FormField {...defaultProps} type="email" testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('renders with password type', () => {
      render(
        <FormField {...defaultProps} type="password" testId="password-input" />,
      );

      const input = screen.getByTestId('password-input');
      expect(input).toHaveAttribute('type', 'password');
    });

    test('renders disabled input when disabled is true', () => {
      render(<FormField {...defaultProps} disabled testId="disabled-input" />);

      const input = screen.getByTestId('disabled-input');
      expect(input).toBeDisabled();
    });
  });

  describe('Value and Change Handling', () => {
    test('displays provided value', () => {
      render(
        <FormField {...defaultProps} value="test value" testId="value-input" />,
      );

      const input = screen.getByTestId('value-input');
      expect(input).toHaveValue('test value');
    });

    test('calls onChange when input value changes', async () => {
      const onChange = vi.fn();

      render(
        <FormField
          {...defaultProps}
          onChange={onChange}
          testId="change-input"
        />,
      );

      const input = screen.getByTestId('change-input');
      await user.type(input, 'new value');

      // userEvent.type fires onChange once per character typed (9 chars in 'new value')
      expect(onChange).toHaveBeenCalledTimes(9);
    });

    test('calls onBlur when input loses focus', async () => {
      const onBlur = vi.fn();

      render(
        <FormField {...defaultProps} onBlur={onBlur} testId="blur-input" />,
      );

      const input = screen.getByTestId('blur-input');

      // Focus then move focus away to trigger blur
      await user.click(input);
      await user.tab();

      expect(onBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error State and Validation', () => {
    test('displays error message when error is provided', () => {
      render(<FormField {...defaultProps} error="This field is required" />);

      const errorMessage = screen.getByText('This field is required');
      expect(errorMessage).toBeInTheDocument();
    });

    test('sets aria-invalid to true when error exists', () => {
      render(
        <FormField
          {...defaultProps}
          error="Invalid email"
          testId="invalid-input"
        />,
      );

      const input = screen.getByTestId('invalid-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('sets aria-invalid to false when no error', () => {
      render(<FormField {...defaultProps} testId="valid-input" />);

      const input = screen.getByTestId('valid-input');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('sets aria-describedby to error element id', () => {
      render(
        <FormField
          {...defaultProps}
          name="email"
          error="Invalid email"
          testId="error-input"
        />,
      );

      const input = screen.getByTestId('error-input');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    test('error element has correct id for aria-describedby', () => {
      render(
        <FormField {...defaultProps} name="email" error="Invalid email" />,
      );

      const errorElement = screen.getByText('Invalid email');
      expect(errorElement).toHaveAttribute('id', 'email-error');
    });

    test('applies invalid styling when error exists', () => {
      render(
        <FormField
          {...defaultProps}
          error="Error message"
          testId="styled-input"
        />,
      );

      const input = screen.getByTestId('styled-input');
      expect(input).toHaveClass('is-invalid');
    });

    test('does not display error when error is null', () => {
      render(<FormField {...defaultProps} error={null} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('does not display error when error is undefined', () => {
      render(<FormField {...defaultProps} error={undefined} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Aria-Live Accessibility', () => {
    test('error message has role="status" by default', () => {
      render(<FormField {...defaultProps} error="Error occurred" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Error occurred');
    });

    test('error message has aria-live="polite" by default', () => {
      render(<FormField {...defaultProps} error="Error occurred" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('does not add role/aria-live when ariaLive is false', () => {
      render(
        <FormField {...defaultProps} error="Error occurred" ariaLive={false} />,
      );

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      const errorElement = screen.getByText('Error occurred');
      expect(errorElement).not.toHaveAttribute('aria-live');
    });
  });

  describe('Helper Text', () => {
    test('displays helper text when provided and no error', () => {
      render(
        <FormField {...defaultProps} helperText="Enter your email address" />,
      );

      const helperText = screen.getByText('Enter your email address');
      expect(helperText).toBeInTheDocument();
      expect(helperText).toHaveClass('text-muted');
    });

    test('does not display helper text when error exists', () => {
      render(
        <FormField
          {...defaultProps}
          helperText="Enter your email address"
          error="Invalid email"
        />,
      );

      expect(
        screen.queryByText('Enter your email address'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    test('aria-describedby points to helper text when no error', () => {
      render(
        <FormField
          {...defaultProps}
          name="email"
          helperText="Helper text"
          testId="helper-input"
        />,
      );

      const input = screen.getByTestId('helper-input');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    });

    test('helper text element has correct id', () => {
      render(
        <FormField {...defaultProps} name="email" helperText="Helper text" />,
      );

      const helperElement = screen.getByText('Helper text');
      expect(helperElement).toHaveAttribute('id', 'email-helper');
    });
  });

  describe('Test ID', () => {
    test('applies data-testid attribute', () => {
      render(<FormField {...defaultProps} testId="custom-test-id" />);

      const input = screen.getByTestId('custom-test-id');
      expect(input).toBeInTheDocument();
    });
  });
});
