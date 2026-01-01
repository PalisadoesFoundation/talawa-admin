import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { PasswordField } from './PasswordField';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        showPassword: 'Show password',
        hidePassword: 'Hide password',
      };
      return translations[key] || key;
    },
  }),
}));

describe('PasswordField', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    value: 'test123',
    onChange: vi.fn(),
  };

  it('renders password field with default masked state', () => {
    render(<PasswordField {...defaultProps} />);

    const input = screen.getByDisplayValue('test123');
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveValue('test123');
  });

  it('renders with label when provided', () => {
    render(<PasswordField {...defaultProps} label="Password" />);

    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('uses default name when not provided', () => {
    render(<PasswordField {...defaultProps} />);

    const input = screen.getByDisplayValue('test123');
    expect(input).toHaveAttribute('name', 'password');
  });

  it('uses custom name when provided', () => {
    render(<PasswordField {...defaultProps} name="confirmPassword" />);

    const input = screen.getByDisplayValue('test123');
    expect(input).toHaveAttribute('name', 'confirmPassword');
  });

  it('toggles password visibility when button is clicked', () => {
    render(<PasswordField {...defaultProps} />);

    const input = screen.getByDisplayValue('test123');
    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    expect(input).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(toggleButton);

    expect(input).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  it('displays error message when error prop is provided', () => {
    render(<PasswordField {...defaultProps} error="Password is required" />);

    const input = screen.getByDisplayValue('test123');
    const errorMessage = screen.getByText('Password is required');

    expect(input).toHaveClass('is-invalid');
    expect(errorMessage).toBeInTheDocument();
  });

  it('supports external visibility control', () => {
    const mockToggle = vi.fn();
    render(
      <PasswordField
        {...defaultProps}
        showPassword={true}
        onToggleVisibility={mockToggle}
      />,
    );

    const input = screen.getByDisplayValue('test123');
    const toggleButton = screen.getByRole('button', { name: 'Hide password' });

    expect(input).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(toggleButton);
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('handles Enter key on toggle button', () => {
    render(<PasswordField {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: 'Show password' });
    const passwordInput = screen.getByDisplayValue('test123');

    // Initially password should be masked
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(toggleButton, { key: 'Enter' });

    // After Enter key, password should be visible
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  it('handles Space key on toggle button', () => {
    render(<PasswordField {...defaultProps} />);

    const toggleButton = screen.getByRole('button', { name: 'Show password' });
    const passwordInput = screen.getByDisplayValue('test123');

    // Initially password should be masked
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    fireEvent.keyDown(toggleButton, { key: ' ' });

    // After Space key, password should be visible
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(toggleButton).toHaveAttribute('aria-label', 'Hide password');
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    render(<PasswordField {...defaultProps} onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('test123');

    fireEvent.change(input, { target: { value: 'newpassword' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('applies testId when provided', () => {
    render(<PasswordField {...defaultProps} testId="password-input" />);

    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('data-testid', 'password-input');
  });

  it('applies placeholder when provided', () => {
    render(<PasswordField {...defaultProps} placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('placeholder', 'Enter password');
  });
});
