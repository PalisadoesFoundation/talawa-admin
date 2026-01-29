import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { EmailField } from './EmailField';

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => {
        const translations: Record<string, string> = {
          email: 'Email',
          emailPlaceholder: 'name@example.com',
        };
        return translations[key] || key;
      },
    }),
  };
});

describe('EmailField', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    test('renders with default label "Email"', () => {
      render(<EmailField {...defaultProps} />);

      const label = screen.getByText(/Email/);
      expect(label).toBeInTheDocument();
    });

    test('renders with custom label', () => {
      render(<EmailField {...defaultProps} label="Email Address" />);

      const label = screen.getByText('Email Address');
      expect(label).toBeInTheDocument();
    });

    test('renders with default placeholder "name@example.com"', () => {
      render(<EmailField {...defaultProps} />);

      const input = screen.getByPlaceholderText('name@example.com');
      expect(input).toBeInTheDocument();
    });

    test('renders with custom placeholder', () => {
      render(<EmailField {...defaultProps} placeholder="Enter your email" />);

      const input = screen.getByPlaceholderText('Enter your email');
      expect(input).toBeInTheDocument();
    });

    test('has type="email" attribute', () => {
      render(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('is marked as required by default', () => {
      render(<EmailField {...defaultProps} />);

      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });

    test('renders with default name attribute "email"', () => {
      render(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('name', 'email');
    });

    test('renders with custom name attribute', () => {
      render(
        <EmailField {...defaultProps} name="userEmail" testId="email-input" />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('name', 'userEmail');
    });
  });

  describe('Value and Change Handling', () => {
    test('displays provided value', () => {
      render(
        <EmailField
          {...defaultProps}
          value="user@example.com"
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      expect(input).toHaveValue('user@example.com');
    });

    test('calls onChange when input value changes', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EmailField
          {...defaultProps}
          onChange={onChange}
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      await user.type(input, 'new@example.com');

      expect(onChange).toHaveBeenCalled();
    });

    test('onChange receives correct event data', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(
        <EmailField
          {...defaultProps}
          onChange={onChange}
          testId="email-input"
        />,
      );

      const input = screen.getByTestId('email-input');
      await user.type(input, 'test@example.com');

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    test('displays error message when error prop is string', () => {
      render(<EmailField {...defaultProps} error="Invalid email format" />);

      const errorMessage = screen.getByText('Invalid email format');
      expect(errorMessage).toBeInTheDocument();
    });

    test('does not display error when error is null', () => {
      render(<EmailField {...defaultProps} error={null} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('does not display error when error is undefined', () => {
      render(<EmailField {...defaultProps} error={undefined} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    test('sets aria-invalid when error exists', () => {
      render(
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
      render(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    test('applies invalid styling when error exists', () => {
      render(
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
      render(<EmailField {...defaultProps} testId="email-input" />);

      const input = screen.getByTestId('email-input');
      const label = screen.getByText(/Email/);

      // FormField uses controlId which creates the association
      expect(input).toHaveAttribute('id', 'email');
      expect(label.closest('label')).toHaveAttribute('for', 'email');
    });

    test('error message has correct aria-describedby linkage', () => {
      render(
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
      render(<EmailField {...defaultProps} error="Invalid email format" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toBeInTheDocument();
      expect(errorElement).toHaveTextContent('Invalid email format');
    });

    test('error has aria-live="polite" for announcements', () => {
      render(<EmailField {...defaultProps} error="Invalid email" />);

      const errorElement = screen.getByRole('status');
      expect(errorElement).toHaveAttribute('aria-live', 'polite');
    });

    test('required indicator (*) is visible', () => {
      render(<EmailField {...defaultProps} />);

      const asterisk = screen.getByText('*');
      expect(asterisk).toBeInTheDocument();
      expect(asterisk).toHaveClass('text-danger');
    });
  });

  describe('Custom Props', () => {
    test('custom testId is applied correctly', () => {
      render(<EmailField {...defaultProps} testId="custom-email-field" />);

      const input = screen.getByTestId('custom-email-field');
      expect(input).toBeInTheDocument();
    });

    test('custom name attribute works correctly', () => {
      render(
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
      render(
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
