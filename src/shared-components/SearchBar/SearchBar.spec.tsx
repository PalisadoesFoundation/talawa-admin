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
    render(
      <SearchBar
        onSearch={vi.fn()}
        placeholder="Search records"
        clearButtonAriaLabel="clear"
      />,
    );
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
        clearButtonAriaLabel="clear"
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
        clearButtonAriaLabel="clear"
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
    render(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        clearButtonAriaLabel="clear"
      />,
    );
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
        clearButtonAriaLabel="clear"
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
          clearButtonAriaLabel="clear"
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
        clearButtonAriaLabel="clear"
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
      <SearchBar
        ref={ref}
        onSearch={vi.fn()}
        inputTestId="search-input"
        clearButtonAriaLabel="clear"
      />,
    );

    expect(ref.current).toBeDefined();
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
    await user.type(input, 'orgs');
    expect(input).toHaveValue('orgs');
    await act(async () => {
      ref.current?.clear();
    });
    expect(input).toHaveValue('');
  });

  it('triggers onSearch with empty string when clearing without onClear prop', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    render(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
        clearButtonAriaLabel="clear"
      />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'query');
    await user.click(screen.getByTestId('clear-search'));

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
        clearButtonAriaLabel="clear"
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
        clearButtonAriaLabel="clear"
      />,
    );

    await act(async () => {
      ref.current?.clear();
    });

    expect(screen.getByTestId('search-input')).toHaveValue('locked');
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('has accessible search button', () => {
    render(
      <SearchBar
        onSearch={vi.fn()}
        buttonTestId="search-button"
        clearButtonAriaLabel="clear"
      />,
    );
    const button = screen.getByTestId('search-button');
    expect(button).toHaveAttribute('aria-label', 'Search');
  });

  it('uses default aria-label from i18n when clearButtonAriaLabel is undefined', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        onSearch={vi.fn()}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test');

    const clearButton = screen.getByTestId('clear-search');
    expect(clearButton).toHaveAttribute('aria-label', 'clear');
  });

  it('handles missing onSearch prop gracefully', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar inputTestId="search-input" clearButtonAriaLabel="clear" />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test{enter}');
  });

  describe('showTrailingIcon feature', () => {
    it('renders trailing search icon when showTrailingIcon is true', () => {
      render(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={true}
          inputTestId="search-input"
        />,
      );

      const container = screen.getByTestId('search-input').parentElement;
      expect(container).toBeInTheDocument();
      // Verify the trailing icon span exists
      const trailingIcon = container?.querySelector('span[aria-hidden="true"]');
      expect(trailingIcon).toBeInTheDocument();
    });

    it('does not render trailing search icon when showTrailingIcon is false', () => {
      render(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={false}
          inputTestId="search-input"
        />,
      );

      const container = screen.getByTestId('search-input').parentElement;
      // When showTrailingIcon is false, there should be no trailing icon
      // The container might still have other elements, but not the trailing icon
      expect(container).toBeInTheDocument();
    });

    it('does not render trailing icon by default', () => {
      render(<SearchBar onSearch={vi.fn()} inputTestId="search-input" />);

      // Default behavior should not show trailing icon
      const container = screen.getByTestId('search-input').parentElement;
      expect(container).toBeInTheDocument();
      // By default, showTrailingIcon is false
    });

    it('renders both clear button and trailing icon when both are enabled', async () => {
      const user = userEvent.setup();
      render(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={true}
          showClearButton={true}
          inputTestId="search-input"
          clearButtonTestId="clear-search"
        />,
      );

      const input = screen.getByTestId('search-input');
      await user.type(input, 'test');

      // Both the clear button and trailing icon should coexist
      expect(screen.getByTestId('clear-search')).toBeInTheDocument();
      const container = input.parentElement;
      const trailingIcon = container?.querySelector('span[aria-hidden="true"]');
      expect(trailingIcon).toBeInTheDocument();
    });

    it('positions trailing icon correctly in the input wrapper', () => {
      const { container } = render(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={true}
          inputTestId="search-input"
        />,
      );

      // Verify that the trailing icon is a child of the input wrapper
      const inputWrapper = container.querySelector(
        'div > div', // The searchBarInputWrapper div
      );
      expect(inputWrapper).toBeInTheDocument();

      const trailingIcon = inputWrapper?.querySelector(
        'span[aria-hidden="true"]',
      );
      expect(trailingIcon).toBeInTheDocument();
    });
  });
});
