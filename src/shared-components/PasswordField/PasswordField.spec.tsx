import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordField from './PasswordField';

describe('PasswordField Component', () => {
  const mockOnChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    label: 'Password',
    value: '',
    onChange: mockOnChange,
  };

  it('should render password field', () => {
    render(<PasswordField {...defaultProps} />);
    expect(screen.getByTestId('passwordField')).toBeInTheDocument();
    expect(screen.getByText('Password')).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(<PasswordField {...defaultProps} />);
    const input = screen.getByTestId('passwordField');
    const toggleButton = screen.getByTestId('passwordField-toggle');

    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should call onChange when input changes', () => {
    render(<PasswordField {...defaultProps} />);
    const input = screen.getByTestId('passwordField');
    fireEvent.change(input, { target: { value: 'test123' } });
    expect(mockOnChange).toHaveBeenCalledWith('test123');
  });

  it('should call onFocus when input gains focus', () => {
    const mockOnFocus = vi.fn();
    render(<PasswordField {...defaultProps} onFocus={mockOnFocus} />);

    const input = screen.getByTestId('passwordField');
    fireEvent.focus(input);

    expect(mockOnFocus).toHaveBeenCalled();
  });

  it('should call onBlur when input loses focus', () => {
    const mockOnBlur = vi.fn();
    render(<PasswordField {...defaultProps} onBlur={mockOnBlur} />);

    const input = screen.getByTestId('passwordField');
    fireEvent.blur(input);

    expect(mockOnBlur).toHaveBeenCalled();
  });

  it('should disable input when disabled prop is true', () => {
    render(<PasswordField {...defaultProps} disabled={true} />);

    const input = screen.getByTestId('passwordField');
    expect(input).toBeDisabled();
  });
});
