import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { EmailField } from './EmailField';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from '../../../utils/i18nForTest';

describe('EmailField', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  const renderWithI18n = (component: React.ReactElement) => {
    return render(
      <I18nextProvider i18n={i18nForTest}>{component}</I18nextProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with default label "Email"', () => {
      renderWithI18n(<EmailField {...defaultProps} />);

      const label = screen.getByText(i18nForTest.t('common:email'));
      expect(label).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      renderWithI18n(<EmailField {...defaultProps} label="Email Address" />);

      const label = screen.getByText('Email Address');
      expect(label).toBeInTheDocument();
    });

    test('renders with default placeholder "name@example.com"', () => {
      renderWithI18n(<EmailField {...defaultProps} />);

      const input = screen.getByPlaceholderText(
        i18nForTest.t('common:emailPlaceholder'),
      );
      expect(input).toBeInTheDocument();
    });

    test('renders with custom placeholder', () => {
      renderWithI18n(
        <EmailField {...defaultProps} placeholder="Enter your email" />,
      );

      const input = screen.getByPlaceholderText('Enter your email');
      expect(input).toBeInTheDocument();
    });

    test('has type="email" attribute', () => {
      renderWithI18n(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('is marked as required by default', () => {
      renderWithI18n(<EmailField {...defaultProps} />);

      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });

    test('renders with default name attribute "email"', () => {
      renderWithI18n(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('name', 'email');
    });

    test('renders with custom name attribute', () => {
      renderWithI18n(
        <EmailField {...defaultProps} name="userEmail" testId="email-input" />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('name', 'userEmail');
    });
  });

  describe('Value and Change Handling', () => {
    test('displays provided value', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          value="user@example.com"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveValue('user@example.com');
    });

    test('calls onChange when input value changes', () => {
      const onChange = vi.fn();
      renderWithI18n(
        <EmailField
          {...defaultProps}
          onChange={onChange}
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      fireEvent.change(input, { target: { value: 'new@example.com' } });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    test('onChange receives correct event data', () => {
      const onChange = vi.fn();
      renderWithI18n(
        <EmailField
          {...defaultProps}
          onChange={onChange}
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      fireEvent.change(input, { target: { value: 'test@example.com' } });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    test('displays error message when error prop is string', () => {
      renderWithI18n(
        <EmailField {...defaultProps} error="Invalid email format" />,
      );

      const errorMessage = screen.getByText('Invalid email format');
      expect(errorMessage).toBeInTheDocument();
    });

    test('does not display error when error is null', () => {
      renderWithI18n(<EmailField {...defaultProps} error={null} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('does not display error when error is undefined', () => {
      renderWithI18n(<EmailField {...defaultProps} error={undefined} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('sets aria-invalid when error exists', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          error="Invalid email"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    test('does not set aria-invalid when no error', () => {
      renderWithI18n(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('applies invalid styling when error exists', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          error="Error message"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveClass('is-invalid');
    });
  });

  describe('Accessibility (A11y)', () => {
    test('label is properly associated with input', () => {
      renderWithI18n(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      const label = screen.getByText(i18nForTest.t('common:email'));

      // FormField uses controlId which creates the association
      expect(input).toHaveAttribute('id', 'email');
      expect(label.closest('label')).toHaveAttribute('for', 'email');
    });

    test('error message has correct aria-describedby linkage', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          error="Invalid email"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');

      const errorElement = screen.getByText('Invalid email');
      expect(errorElement).toHaveAttribute('id', 'email-error');
    });

    test('error has role="status" for screen readers', () => {
      renderWithI18n(
        <EmailField {...defaultProps} error="Invalid email format" />,
      );

      const errorElement = screen.getByRole('status');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Invalid email format');
    });

    test('error has aria-live="polite" for announcements', () => {
      renderWithI18n(<EmailField {...defaultProps} error="Invalid email" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('required indicator (*) is visible', () => {
      renderWithI18n(<EmailField {...defaultProps} />);

      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });
  });

  describe('Custom Props', () => {
    test('custom testId is applied correctly', () => {
      renderWithI18n(
        <EmailField {...defaultProps} testId="custom-email-field" />,
      );

      const input = screen.getByTestId('custom-email-field');
      expect(input).toBeInTheDocument();
    });

    test('custom name attribute works correctly', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          name="customerEmail"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('name', 'customerEmail');
    });
  });

  describe('Integration with FormField', () => {
    test('passes all props correctly to FormField', () => {
      renderWithI18n(
        <EmailField
          {...defaultProps}
          label="Work Email"
          name="workEmail"
          value="work@company.com"
          placeholder="your.email@company.com"
          error="Email already exists"
          testId="work-email-input"
        />,
      );

      // Label
      expect(screen.getByText('Work Email')).toBeInTheDocument();

      // Input with correct attributes
      const input = screen.getByTestId('work-email-input');
      expect(input).toHaveAttribute('name', 'workEmail');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveValue('work@company.com');
      expect(input).toHaveAttribute('placeholder', 'your.email@company.com');

      // Error
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });
});
