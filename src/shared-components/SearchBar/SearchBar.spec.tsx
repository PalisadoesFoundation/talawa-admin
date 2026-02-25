import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import SearchBar from './SearchBar';
import type { InterfaceSearchBarRef } from 'types/SearchBar/interface';
import i18n from 'utils/i18nForTest';
import styles from './SearchBar.module.css';

/**
 * Helper function to render components with I18nextProvider
 * Ensures consistent i18n context across all tests
 */
const renderWithI18n = (ui: React.ReactElement): RenderResult => {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SearchBar', () => {
  it('renders with the provided placeholder', () => {
    renderWithI18n(
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
    renderWithI18n(
      <SearchBar
        onSearch={vi.fn()}
        onChange={handleChange}
        inputTestId="search-input"
        clearButtonAriaLabel="clear"
      />,
    );

    await user.type(screen.getByTestId('search-input'), 'team');
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled();
      expect(handleChange).toHaveBeenLastCalledWith('team', expect.any(Object));
    });
  });

  it('calls onSearch when search button is clicked', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithI18n(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        buttonTestId="search-button"
        clearButtonAriaLabel="clear"
      />,
    );
    await user.type(screen.getByTestId('search-input'), 'volunteer');
    await user.click(screen.getByTestId('search-button'));

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(
        'volunteer',
        expect.objectContaining({ trigger: 'button' }),
      );
    });
  });

  it('submits search when Enter key is pressed', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithI18n(
      <SearchBar
        onSearch={handleSearch}
        inputTestId="search-input"
        clearButtonAriaLabel="clear"
      />,
    );
    await user.type(screen.getByTestId('search-input'), 'events{enter}');

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(
        'events',
        expect.objectContaining({ trigger: 'enter' }),
      );
    });
  });

  it('clears the input value and notifies listeners', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    renderWithI18n(
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

    await waitFor(() => {
      expect(handleClear).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith('', expect.any(Object));
      expect(handleSearch).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });
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
    renderWithI18n(<Example />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('initial');
    await user.clear(input);
    await user.type(input, 'updated');
    await waitFor(() => {
      expect(input).toHaveValue('updated');
    });
  });

  it('hides the button when showSearchButton is false', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithI18n(
      <SearchBar
        onSearch={handleSearch}
        showSearchButton={false}
        inputTestId="search-input"
        clearButtonAriaLabel="clear"
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    await user.type(screen.getByTestId('search-input'), 'filters{enter}');
    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(
        'filters',
        expect.objectContaining({ trigger: 'enter' }),
      );
    });
  });

  it('exposes imperative focus and clear helpers via ref', async () => {
    const user = userEvent.setup();
    const ref = React.createRef<InterfaceSearchBarRef>();
    renderWithI18n(
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
    await act(async () => {
      ref.current?.focus();
    });
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    // Test blur
    await act(async () => {
      ref.current?.blur();
    });
    await waitFor(() => {
      expect(input).not.toHaveFocus();
    });

    // Test clear
    await user.type(input, 'orgs');
    await waitFor(() => {
      expect(input).toHaveValue('orgs');
    });
    await act(async () => {
      ref.current?.clear();
    });
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('triggers onSearch with empty string when clearing without onClear prop', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    renderWithI18n(
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

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith(
        '',
        expect.objectContaining({ trigger: 'clear' }),
      );
      expect(input).toHaveValue('');
    });
  });

  it('hides clear button when disabled', async () => {
    const handleClear = vi.fn();
    const handleChange = vi.fn();
    renderWithI18n(
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
    renderWithI18n(
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

    await waitFor(() => {
      expect(screen.getByTestId('search-input')).toHaveValue('locked');
      expect(handleSearch).not.toHaveBeenCalled();
    });
  });

  it('has accessible search button', () => {
    renderWithI18n(
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
    renderWithI18n(
      <SearchBar
        onSearch={vi.fn()}
        inputTestId="search-input"
        clearButtonTestId="clear-search"
      />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test');

    await waitFor(() => {
      const clearButton = screen.getByTestId('clear-search');
      expect(clearButton).toHaveAttribute('aria-label', 'Clear');
    });
  });

  it('handles missing onSearch prop gracefully', async () => {
    const user = userEvent.setup();
    renderWithI18n(
      <SearchBar inputTestId="search-input" clearButtonAriaLabel="clear" />,
    );

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test{enter}');

    // Verify component doesn't crash and maintains input value
    await waitFor(() => {
      expect(input).toHaveValue('test');
    });
  });

  describe('showTrailingIcon feature', () => {
    it('renders trailing search icon when showTrailingIcon is true', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={true}
          inputTestId="search-input"
        />,
      );

      // Verify the trailing icon exists using data-testid
      const trailingIcon = screen.getByTestId('trailing-icon');
      expect(trailingIcon).toBeInTheDocument();
    });

    it('does not render trailing search icon when showTrailingIcon is false', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={false}
          inputTestId="search-input"
        />,
      );

      // When showTrailingIcon is false, trailing icon should not be present
      const trailingIcon = screen.queryByTestId('trailing-icon');
      expect(trailingIcon).not.toBeInTheDocument();
    });

    it('does not render trailing icon by default', () => {
      renderWithI18n(
        <SearchBar onSearch={vi.fn()} inputTestId="search-input" />,
      );

      // By default, showTrailingIcon is false, so icon should not be present
      const trailingIcon = screen.queryByTestId('trailing-icon');
      expect(trailingIcon).not.toBeInTheDocument();
    });

    it('renders both clear button and trailing icon when both are enabled', async () => {
      const user = userEvent.setup();
      renderWithI18n(
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

      await waitFor(() => {
        // Both the clear button and trailing icon should coexist
        expect(screen.getByTestId('clear-search')).toBeInTheDocument();
        expect(screen.getByTestId('trailing-icon')).toBeInTheDocument();
      });
    });

    it('positions trailing icon correctly in the input wrapper', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showTrailingIcon={true}
          inputTestId="search-input"
        />,
      );

      // Verify proper DOM relationship: trailing icon should be a child of input wrapper
      const input = screen.getByTestId('search-input');
      const inputWrapper = input.parentElement;
      const trailingIcon = screen.getByTestId('trailing-icon');
      expect(inputWrapper).toContainElement(trailingIcon);
    });
  });

  describe('Visual variants and sizes', () => {
    it('applies filled variant styles', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          variant="filled"
          inputTestId="search-input"
        />,
      );
      const inputWrapper = screen.getByTestId('search-input').parentElement;
      expect(inputWrapper).toHaveClass(styles.searchBarVariantFilled);
    });

    it('applies ghost variant styles', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          variant="ghost"
          inputTestId="search-input"
        />,
      );
      const inputWrapper = screen.getByTestId('search-input').parentElement;
      expect(inputWrapper).toHaveClass(styles.searchBarVariantGhost);
    });

    it('applies small size styles', () => {
      renderWithI18n(
        <SearchBar onSearch={vi.fn()} size="sm" inputTestId="search-input" />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass(styles.searchBarInputSm);
    });

    it('applies large size styles', () => {
      renderWithI18n(
        <SearchBar onSearch={vi.fn()} size="lg" inputTestId="search-input" />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass(styles.searchBarInputLg);
    });

    it('applies combined variant and size styles', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          variant="filled"
          size="lg"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      const inputWrapper = input.parentElement;
      expect(inputWrapper).toHaveClass(styles.searchBarVariantFilled);
      expect(input).toHaveClass(styles.searchBarInputLg);
    });
  });

  describe('Icon customization', () => {
    it('renders with showLeadingIcon enabled', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showLeadingIcon={true}
          inputTestId="search-input"
        />,
      );
      const leadingIcon = screen.getByTestId('leading-icon');
      expect(leadingIcon).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
      const CustomIcon = <span data-testid="custom-icon">🔍</span>;
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showLeadingIcon={true}
          icon={CustomIcon}
          inputTestId="search-input"
        />,
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('does not render leading icon by default', () => {
      renderWithI18n(
        <SearchBar onSearch={vi.fn()} inputTestId="search-input" />,
      );
      // By default, showLeadingIcon is false, so icon should not be present
      const leadingIcon = screen.queryByTestId('leading-icon');
      expect(leadingIcon).not.toBeInTheDocument();
    });
  });

  describe('Button customization', () => {
    it('renders search button with custom label', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          buttonLabel="Search Now"
          buttonTestId="search-button"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toHaveTextContent('Search Now');
    });

    it('renders search button with custom aria-label', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          buttonAriaLabel="Find records"
          buttonTestId="search-button"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toHaveAttribute('aria-label', 'Find records');
    });

    it('renders search button in loading state', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          isLoading={true}
          buttonTestId="search-button"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toBeDisabled();
    });

    it('disables search button when disabled prop is true', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          disabled={true}
          buttonTestId="search-button"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toBeDisabled();
    });

    it('renders icon-only button without label', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          buttonTestId="search-button"
          buttonAriaLabel="Search"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Search');
    });
  });

  describe('Input attributes', () => {
    it('supports custom autoComplete attribute', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          autoComplete="on"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveAttribute('autocomplete', 'on');
    });

    it('supports custom type attribute', () => {
      renderWithI18n(
        <SearchBar onSearch={vi.fn()} type="text" inputTestId="search-input" />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('supports disabled input', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          disabled={true}
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toBeDisabled();
      await user.type(input, 'test');
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });
  });

  describe('CSS class customization', () => {
    it('applies custom className to container', () => {
      const { container } = renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          className="custom-container"
          inputTestId="search-input"
        />,
      );
      const searchBarContainer = container.querySelector('.custom-container');
      expect(searchBarContainer).toBeInTheDocument();
    });

    it('applies custom inputClassName', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          inputClassName="custom-input"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveClass('custom-input');
    });

    it('applies custom buttonClassName', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          buttonClassName="custom-button"
          buttonTestId="search-button"
        />,
      );
      const button = screen.getByTestId('search-button');
      expect(button).toHaveClass('custom-button');
    });
  });

  describe('Edge cases', () => {
    it('handles onChange callback without event parameter', async () => {
      const handleChange = vi.fn();
      const ref = React.createRef<InterfaceSearchBarRef>();
      renderWithI18n(
        <SearchBar
          ref={ref}
          onSearch={vi.fn()}
          onChange={handleChange}
          inputTestId="search-input"
        />,
      );

      // Trigger clear via ref which may call onChange without a real event
      await act(async () => {
        ref.current?.clear();
      });

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('', expect.any(Object));
      });
    });

    it('handles controlled mode with value prop provided', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          value="controlled value"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('controlled value');
    });

    it('handles controlled mode when value changes from empty string to string', async () => {
      const { rerender } = renderWithI18n(
        <SearchBar onSearch={vi.fn()} value="" inputTestId="search-input" />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');

      rerender(
        <I18nextProvider i18n={i18n}>
          <SearchBar
            onSearch={vi.fn()}
            value="new value"
            inputTestId="search-input"
          />
        </I18nextProvider>,
      );
      await waitFor(() => {
        expect(input).toHaveValue('new value');
      });
    });

    it('handles uncontrolled mode with undefined value', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          value={undefined}
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');
    });

    it('updates internal state when value changes from undefined to string in controlled mode', async () => {
      const { rerender } = renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          value={undefined}
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('');

      rerender(
        <I18nextProvider i18n={i18n}>
          <SearchBar
            onSearch={vi.fn()}
            value="updated"
            inputTestId="search-input"
          />
        </I18nextProvider>,
      );
      await waitFor(() => {
        expect(input).toHaveValue('updated');
      });
    });

    it('clears value in controlled mode via ref', async () => {
      const handleChange = vi.fn();
      const ref = React.createRef<InterfaceSearchBarRef>();
      renderWithI18n(
        <SearchBar
          ref={ref}
          onSearch={vi.fn()}
          onChange={handleChange}
          value="controlled"
          inputTestId="search-input"
        />,
      );

      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('controlled');

      // Clear in controlled mode - should NOT update internal state
      // but should emit change event
      await act(async () => {
        ref.current?.clear();
      });

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith('', expect.any(Object));
      });
    });

    it('hides clear button when input is empty', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          inputTestId="search-input"
          clearButtonTestId="clear-search"
        />,
      );
      expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument();
    });

    it('hides clear button when showClearButton is false', async () => {
      const user = userEvent.setup();
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          showClearButton={false}
          inputTestId="search-input"
          clearButtonTestId="clear-search"
        />,
      );
      const input = screen.getByTestId('search-input');
      await user.type(input, 'test');
      await waitFor(() => {
        expect(screen.queryByTestId('clear-search')).not.toBeInTheDocument();
      });
    });

    it('handles uncontrolled mode with defaultValue', () => {
      renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          defaultValue="initial value"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('initial value');
    });

    it('syncs internal state when value prop changes in controlled mode', async () => {
      const { rerender } = renderWithI18n(
        <SearchBar
          onSearch={vi.fn()}
          value="first"
          inputTestId="search-input"
        />,
      );
      const input = screen.getByTestId('search-input');
      expect(input).toHaveValue('first');

      rerender(
        <I18nextProvider i18n={i18n}>
          <SearchBar
            onSearch={vi.fn()}
            value="second"
            inputTestId="search-input"
          />
        </I18nextProvider>,
      );
      await waitFor(() => {
        expect(input).toHaveValue('second');
      });
    });
  });
});
