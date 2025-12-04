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
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
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
});
