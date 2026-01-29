import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Autocomplete } from './Autocomplete';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('Autocomplete', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without errors', () => {
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards props to MuiAutocomplete', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        value="Option 1"
        onChange={mockOnChange}
        disabled={false}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();

    // Open the autocomplete dropdown
    await user.click(combobox);

    // Wait for the listbox to appear
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Find and click "Option 2" from the options list
    const option2 = await screen.findByText('Option 2');
    await user.click(option2);

    // Verify onChange was called when selecting the option
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles empty options array', () => {
    render(
      <Autocomplete
        options={[]}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        disabled={true}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeDisabled();
  });

  it('supports generic typing', () => {
    interface InterfaceTestOption {
      id: number;
      label: string;
    }

    const options: InterfaceTestOption[] = [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
    ];

    render(
      <Autocomplete<InterfaceTestOption, false, false, false>
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
