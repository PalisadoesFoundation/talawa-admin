import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
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

    // Test focus
    ref.current?.focus();
    const input = screen.getByTestId('search-input');
    expect(input).toHaveFocus();

    // Test blur
    ref.current?.blur();
    expect(input).not.toHaveFocus();

    // Test clear
    await user.type(input, 'orgs');
    await act(async () => {
      ref.current?.clear();
    });
    expect(input).toHaveValue('');
  });

  it('triggers onSearch with empty string when clearing without onClear prop', async () => {
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    const input = screen.getByTestId('search-input');
    await userEvent.type(input, 'query');
    await userEvent.click(screen.getByTestId('clear-search'));

    expect(handleSearch).toHaveBeenCalledWith(
      '',
      expect.objectContaining({ trigger: 'clear' }),
    );
    expect(input).toHaveValue('');
  });

  it('hides clear button when disabled', async () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    render(
      <SearchBar
        onSearch={vi.fn()}
        onClear={handleClear}
        onChange={handleChange}
        disabled={true}
        value="locked"
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    // Clear button should not be rendered when disabled usually, but if we force it or check logic
    // The component logic says: showClearButton && currentValue.length > 0 && !disabled
    // So the button won't exist. Let's verify that first.
    expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument();
  });

  it('prevents clearing via ref when disabled', async () => {
    const ref = React.createRef<InterfaceSearchBarRef>();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        ref={ref}
        onSearch={handleSearch}
        disabled={true}
        defaultValue="locked"
        inputTestId="search-input"
      />,
    );

    await act(async () => {
      ref.current?.clear();
    });

    expect(screen.getByTestId('search-input')).toHaveValue('locked');
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('has accessible search button', () => {
    render(<SearchBar onSearch={vi.fn()} buttonTestId="search-button" />);
    const button = screen.getByTestId('search-button');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });

  it('handles missing onSearch prop gracefully', async () => {
    const user = userEvent.setup();
    render(<SearchBar inputTestId="search-input" />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test{enter}');
    // Should not throw
  });

  it('clears the input value without onClear prop', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'pledge');
    await user.click(screen.getByTestId('clear-search'));

    expect(input).toHaveValue('');
    // When onClear is NOT provided, it should trigger search with empty string
    expect(handleSearch).toHaveBeenCalledWith(
      '',
      expect.objectContaining({ trigger: 'clear' }),
    );
  });

  it('exposes imperative handle methods', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<InterfaceSearchBarRef>();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        ref={ref}
        onSearch={handleSearch}
        inputTestId="search-input"
      />,
    );

    const input = screen.getByTestId('search-input');

    // Test focus
    act(() => {
      ref.current?.focus();
    });
    expect(input).toHaveFocus();

    // Test blur
    act(() => {
      ref.current?.blur();
    });
    expect(input).not.toHaveFocus();

    // Test clear
    await user.type(input, 'test');
    expect(input).toHaveValue('test');
    act(() => {
      ref.current?.clear();
    });
    expect(input).toHaveValue('');
  });
});
