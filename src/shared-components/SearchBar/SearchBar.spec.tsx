import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
import type { InterfaceSearchBarRef } from 'types/SearchBar/interface';

describe('SearchBar', () => {
  it('renders with the provided placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Search records" />);
    expect(screen.getByPlaceholderText('Search records')).toBeInTheDocument();
  });

  it('calls onChange handler when typing', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <SearchBar
        onSearch={vi.fn()}
        onChange={handleChange}
        inputTestId="search-input"
      />,
    );

    await user.type(screen.getByTestId('search-input'), 'team');
    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls.at(-1)?.[0]).toBe('team');
  });

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        buttonTestId="search-button"
      />,
    );
    await user.type(screen.getByTestId('search-input'), 'volunteer');
    await user.click(screen.getByTestId('search-button'));

    expect(handleSearch).toHaveBeenCalledWith(
      'volunteer',
      expect.objectContaining({ trigger: 'button' }),
    );
  });

  it('submits search when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} inputTestId="search-input" />);
    await user.type(screen.getByTestId('search-input'), 'events{enter}');

    expect(handleSearch).toHaveBeenCalledWith(
      'events',
      expect.objectContaining({ trigger: 'enter' }),
    );
  });

  it('clears the input value and notifies listeners', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
        onChange={handleChange}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'pledge');
    await user.click(screen.getByTestId('clear-search'));

    expect(handleClear).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('', expect.any(Object));
    // When onClear is provided, onSearch should NOT be called to avoid duplicate side effects
    expect(handleSearch).not.toHaveBeenCalled();
    expect(input).toHaveValue('');
  });

  it('supports controlled mode', async () => {
    const user = userEvent.setup();
    const Example = (): JSX.Element => {
      const [term, setTerm] = React.useState('initial');
      return (
        <SearchBar
          value={term}
          onSearch={vi.fn()}
          onChange={(nextValue) => setTerm(nextValue)}
          inputTestId="search-input"
        />
      );
    };
    render(<Example />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('initial');
    await user.clear(input);
    await user.type(input, 'updated');
    expect(input).toHaveValue('updated');
  });

  it('hides the button when showSearchButton is false', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        showSearchButton={false}
        inputTestId="search-input"
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await user.type(screen.getByTestId('search-input'), 'filters{enter}');
    expect(handleSearch).toHaveBeenCalledWith(
      'filters',
      expect.objectContaining({ trigger: 'enter' }),
    );
  });

  it('exposes imperative focus and clear helpers via ref', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<InterfaceSearchBarRef>();
    render(
      <SearchBar ref={ref} onSearch={vi.fn()} inputTestId="search-input" />,
    );

    expect(ref.current).toBeDefined();
    ref.current?.focus();
    const input = screen.getByTestId('search-input');
    expect(input).toHaveFocus();
    await user.type(input, 'orgs');
    await act(async () => {
      ref.current?.clear();
    });
    expect(input).toHaveValue('');
  });
});
