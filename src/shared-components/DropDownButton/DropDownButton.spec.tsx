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
});
