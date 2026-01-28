import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from './TextField';
import { describe, it, expect, vi } from 'vitest';

describe('TextField', () => {
  it('renders without errors', () => {
    render(<TextField label="Test Label" />);
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('forwards label prop to MuiTextField', () => {
    render(<TextField label="Username" />);
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    render(<TextField label="Disabled Field" disabled={true} />);
    const input = screen.getByLabelText('Disabled Field');
    expect(input).toBeDisabled();
  });

  it('renders error state', () => {
    render(<TextField label="Email" error={true} helperText="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('handles value and onChange', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();

    render(<TextField label="Input Field" value="" onChange={mockOnChange} />);

    const input = screen.getByLabelText('Input Field');
    await user.type(input, 'test');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('forwards all props to MuiTextField', () => {
    render(
      <TextField
        label="Full Test"
        value="test value"
        placeholder="Enter text"
        helperText="Helper text"
        required={true}
      />,
    );

    expect(screen.getByLabelText('Full Test *')).toBeInTheDocument();
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });
});
