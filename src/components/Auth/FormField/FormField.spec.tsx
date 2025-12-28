import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';
import type { InterfaceFormFieldProps } from '../../../types/Auth/FormField/interface';

describe('FormField', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: InterfaceFormFieldProps = {
    name: 'test-field',
    value: '',
    onChange: vi.fn(),
  };

  describe('Rendering', () => {
    it('should render basic input field', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'test-field');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render with label when provided', () => {
      render(<FormField {...defaultProps} label="Test Label" />);

      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    it('should render required indicator when required', () => {
      render(<FormField {...defaultProps} label="Test Label" required />);

      expect(screen.getByText('*')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-danger');
    });

    it('should render with different input types', () => {
      const { rerender } = render(<FormField {...defaultProps} type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

      rerender(<FormField {...defaultProps} type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    });

    it('should render with placeholder', () => {
      render(<FormField {...defaultProps} placeholder="Enter text" />);

      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should render with test id', () => {
      render(<FormField {...defaultProps} testId="custom-test-id" />);

      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });
  });

  describe('Error Display', () => {
    it('should display error message when error prop is provided', () => {
      render(<FormField {...defaultProps} error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('should not display error when error is null', () => {
      render(<FormField {...defaultProps} error={null} />);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });

    it('should apply invalid styling when error exists', () => {
      render(<FormField {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('is-invalid');
    });
  });

  describe('Accessibility', () => {
    it('should set aria-invalid to true when error is present', () => {
      render(<FormField {...defaultProps} error="Error message" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should set aria-invalid to false when no error', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria-invalid to false when error is null', () => {
      render(<FormField {...defaultProps} error={null} />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-invalid', 'false');
    });

    it('should set aria-describedby to error id when error is present', () => {
      render(
        <FormField {...defaultProps} name="email" error="Invalid email" />,
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });

    it('should not have aria-describedby when no error', () => {
      render(<FormField {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('should not have aria-describedby when error is null', () => {
      render(<FormField {...defaultProps} error={null} />);

      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('aria-describedby');
    });

    it('should create error element with correct id matching aria-describedby', () => {
      render(
        <FormField
          {...defaultProps}
          name="password"
          error="Password required"
        />,
      );

      const input = screen.getByRole('textbox');
      const errorElement = screen.getByText('Password required');

      expect(input).toHaveAttribute('aria-describedby', 'password-error');
      expect(errorElement).toHaveAttribute('id', 'password-error');
    });
  });

  describe('Interactions', () => {
    it('should call onChange when input value changes', async () => {
      const user = userEvent.setup();
      const mockOnChange = vi.fn();

      render(<FormField {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'test');

      expect(mockOnChange).toHaveBeenCalled();
    });

    it('should call onBlur when input loses focus', async () => {
      const user = userEvent.setup();
      const mockOnBlur = vi.fn();

      render(<FormField {...defaultProps} onBlur={mockOnBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(mockOnBlur).toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<FormField {...defaultProps} disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });
});
