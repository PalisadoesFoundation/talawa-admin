import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InterfaceDropDownButtonProps } from 'types/shared-components/DropDownButton/interface';
import DropDownButton from './DropDownButton';
import {
  baseProps,
  noSelectionProps,
  disabledDropdownProps,
  customLabelProps,
  withIconProps,
  styledProps,
  disabledOptionProps,
  variantProps,
  mockOnSelect,
  noTestIdProps,
  dropUpProps,
} from './DropDownButton.mocks';
import i18nForTest from 'utils/i18nForTest';

const renderComponent = (props: InterfaceDropDownButtonProps) => {
  return render(<DropDownButton {...props} />);
};

describe('DropDownButton Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropdown button correctly', () => {
    renderComponent(baseProps);

    const button = screen.getByTestId('test-dropdown-toggle');
    expect(button).toBeInTheDocument();
  });

  it('shows selected option label when selectedValue is provided', () => {
    renderComponent(baseProps);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  it('shows placeholder when no option is selected', () => {
    renderComponent(noSelectionProps);

    expect(screen.getByText('Choose an option')).toBeInTheDocument();
  });

  it('renders custom button label when provided', () => {
    renderComponent(customLabelProps);

    expect(screen.getByText('Custom Button Label')).toBeInTheDocument();
  });

  it('renders icon when icon prop is provided', () => {
    renderComponent(withIconProps);

    const icon = screen.getByTestId('dropdown-icon');
    expect(icon).toBeInTheDocument();
  });

  it('disables dropdown when disabled prop is true', () => {
    renderComponent(disabledDropdownProps);

    const button = screen.getByTestId('test-dropdown-toggle');
    expect(button).toBeDisabled();
  });

  it('opens dropdown menu on click', async () => {
    renderComponent(baseProps);

    const button = screen.getByTestId('test-dropdown-toggle');
    await userEvent.click(button);

    const menu = screen.getByTestId('test-dropdown-menu');
    expect(menu).toBeInTheDocument();
  });

  it('calls onSelect when an option is selected', async () => {
    renderComponent(baseProps);

    await userEvent.click(screen.getByTestId('test-dropdown-toggle'));
    await userEvent.click(screen.getByTestId('test-dropdown-item-2'));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith('2');
  });

  it('does not call onSelect when a disabled option is selected', async () => {
    renderComponent(disabledOptionProps);

    await userEvent.click(screen.getByTestId('test-dropdown-toggle'));
    await userEvent.click(screen.getByTestId('test-dropdown-item-2'));

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('applies custom container and button styles', () => {
    renderComponent(styledProps);

    const container = screen.getByTestId('test-dropdown-container');
    const button = screen.getByTestId('test-dropdown-toggle');

    expect(container.className).toContain('custom-container');
    expect(button.className).toContain('custom-button');
  });

  it('applies variant correctly', () => {
    renderComponent(variantProps);

    const button = screen.getByTestId('test-dropdown-toggle');
    expect(button.className).toContain('btn-primary');
  });

  it('sets correct aria attributes for accessibility', () => {
    renderComponent(baseProps);

    const button = screen.getByTestId('test-dropdown-toggle');

    expect(button).toHaveAttribute('aria-label', 'Test Dropdown');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not render icon wrapper when icon is undefined', () => {
    renderComponent(baseProps);

    expect(screen.queryByTestId('dropdown-icon')).not.toBeInTheDocument();
  });

  it('uses default aria-label for menu when ariaLabel is not provided', async () => {
    renderComponent({
      ...baseProps,
      ariaLabel: undefined,
    });

    await userEvent.click(screen.getByTestId('test-dropdown-toggle'));

    const menu = screen.getByRole('listbox');
    expect(menu).toHaveAttribute(
      'aria-label',
      i18nForTest.t('common:optionsSuffix'),
    );
  });

  it('uses default data-testid prefix when dataTestIdPrefix is not provided', () => {
    renderComponent(noTestIdProps);
    const button = screen.getByTestId('dropdown-toggle');
    expect(button).toBeInTheDocument();
  });

  it('opens dropdown menu upwards when drop up is provided', async () => {
    renderComponent(dropUpProps);
    const button = screen.getByTestId('test-dropdown-toggle');
    await userEvent.click(button);
    const menu = screen.getByTestId('test-dropdown-menu');
    expect(menu.parentElement).toHaveClass('dropup');
  });
  it('does not show caret when showCaret is false', () => {
    renderComponent({
      ...baseProps,
      showCaret: false,
    });
    const caret = screen.queryByText('▼');
    expect(caret).not.toBeInTheDocument();
  });
  describe('Searchable DropDownButton', () => {
    const searchableProps = {
      ...baseProps,
      searchable: true,
      searchPlaceholder: 'Search options...',
      selectedValue: undefined,
    };

    it('renders SearchToggle when searchable is true', () => {
      renderComponent(searchableProps);
      expect(screen.getByTestId('test-dropdown-input')).toBeInTheDocument();
      expect(
        screen.queryByTestId('test-dropdown-toggle'),
      ).not.toBeInTheDocument();
    });

    it('updates internal searchTerm and filters options when typing', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');

      // Helper to scroll input into view if needed (though not strictly required for unit tests usually)
      await userEvent.type(input, 'Option 1');

      expect(input).toHaveValue('Option 1');

      // The menu should be open and contain only the matching option
      const menu = screen.getByTestId('test-dropdown-menu');
      expect(menu).toHaveClass('show');

      const option1 = screen.getByText('Option 1');
      expect(option1).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('shows "No options found" message when no options match', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');

      await userEvent.type(input, 'Nonexistent Option');

      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    it('syncs searchTerm with selectedValue prop', () => {
      // explicit selectedValue to test sync
      renderComponent({ ...searchableProps, selectedValue: '1' });
      const input = screen.getByTestId(
        'test-dropdown-input',
      ) as HTMLInputElement;

      // Should match label of option with value '1'
      expect(input.value).toBe('Option 1');
    });

    it('updates searchTerm and closes menu on selection', async () => {
      renderComponent({ ...searchableProps, selectedValue: undefined });
      const input = screen.getByTestId('test-dropdown-input');

      await userEvent.click(input); // Open menu
      await userEvent.click(screen.getByText('Option 2'));

      expect(mockOnSelect).toHaveBeenCalledWith('2');
      // searchTerm update is immediate in component
      expect(input).toHaveValue('Option 2');
    });

    it('opens menu on input click', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');

      await userEvent.click(input);
      expect(screen.getByTestId('test-dropdown-menu')).toHaveClass('show');
    });

    it('opens menu on Enter key press', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');
      input.focus();
      await userEvent.keyboard('{Enter}');
      expect(screen.getByTestId('test-dropdown-menu')).toHaveClass('show');
    });

    it('closes menu on Escape key', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');
      await userEvent.click(input);
      await userEvent.keyboard('{Escape}');
      expect(screen.queryByTestId('test-dropdown-menu')).not.toHaveClass(
        'show',
      );
    });

    it('navigates and selects options with keyboard (ArrowDown/Enter)', async () => {
      renderComponent(searchableProps);
      const input = screen.getByTestId('test-dropdown-input');

      // Open menu
      await userEvent.click(input);

      // Navigate down. React-Bootstrap usually focuses the first item on ArrowDown from toggle
      // However, since our toggle is an input, focus logic might differ.
      // If standard Bootstrap Dropdown, first ArrowDown focuses first item.
      await userEvent.keyboard('{ArrowDown}');

      // We expect focus to move to the first option
      // const option1 = screen.getByText('Option 1');
      // expect(option1).toHaveFocus();

      // Select it
      await userEvent.keyboard('{Enter}');

      // Expect selection callback
      expect(mockOnSelect).toHaveBeenCalledWith('1');
    });
  });
});
