import React from 'react';
import { render, screen } from '@testing-library/react';
import { Autocomplete } from './Autocomplete';
import { describe, it, expect, vi } from 'vitest';

describe('Autocomplete', () => {
  it('renders without errors', () => {
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('forwards props to MuiAutocomplete', () => {
    const mockOnChange = vi.fn();
    render(
      <Autocomplete
        options={['Option 1', 'Option 2']}
        value="Option 1"
        onChange={mockOnChange}
        disabled={false}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
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
    interface Option {
      id: number;
      label: string;
    }

    const options: Option[] = [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
    ];

    render(
      <Autocomplete<Option, false, false, false>
        options={options}
        getOptionLabel={(option) => option.label}
        renderInput={(params) => <input {...params.inputProps} />}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});
