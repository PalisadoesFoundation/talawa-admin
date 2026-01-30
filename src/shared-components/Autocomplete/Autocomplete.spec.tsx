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
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
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
        disablePortal={true}
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );
    const combobox = screen.getByRole('combobox');
    expect(combobox).toBeInTheDocument();

    // Open the autocomplete dropdown using keyboard
    await user.click(combobox);
    await user.keyboard('{ArrowDown}');

    // Wait for the listbox to appear
    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    // Find and click "Option 2" from the options list
    const option2 = await screen.findByRole('option', { name: 'Option 2' });
    await user.click(option2);

    // Verify onChange was called when selecting the option
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles empty options array', () => {
    render(
      <Autocomplete
        options={[]}
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders in disabled state', () => {
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        disabled={true}
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
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
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('supports multiple selection', async () => {
    interface InterfaceTestOption {
      id: number;
      label: string;
    }

    const options: InterfaceTestOption[] = [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
      { id: 3, label: 'Third' },
    ];

    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Autocomplete<InterfaceTestOption, true, false, false>
        options={options}
        multiple
        value={[options[0]]}
        onChange={mockOnChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const option2 = await screen.findByRole('option', { name: 'Second' });
    await user.click(option2);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('supports freeSolo for custom input values', async () => {
    interface InterfaceTestOption {
      id: number;
      label: string;
    }

    const options: InterfaceTestOption[] = [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
    ];

    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Autocomplete<InterfaceTestOption, false, false, true>
        options={options}
        freeSolo
        onChange={mockOnChange}
        getOptionLabel={(option) =>
          typeof option === 'string' ? option : option.label
        }
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );

    const combobox = screen.getByRole('combobox');
    await user.click(combobox);
    await user.type(combobox, 'Custom Value');

    // Verify that custom input is accepted
    expect(combobox).toHaveValue('Custom Value');
  });

  it('supports disableClearable to prevent clearing value', async () => {
    interface InterfaceTestOption {
      id: number;
      label: string;
    }

    const options: InterfaceTestOption[] = [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
    ];

    const mockOnChange = vi.fn();

    render(
      <Autocomplete<InterfaceTestOption, false, true, false>
        options={options}
        value={options[0]}
        disableClearable
        onChange={mockOnChange}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => (
          <div {...params.InputProps}>
            <input {...params.inputProps} />
          </div>
        )}
      />,
    );

    const combobox = screen.getByRole('combobox');
    expect(combobox).toHaveValue('First');

    // With disableClearable, there should be no clear button
    const clearButton = screen.queryByTitle('Clear');
    expect(clearButton).not.toBeInTheDocument();
  });
});
