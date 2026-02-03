/**
 * Mocks and test props for DropDownButton component
 *
 * @remarks
 * This file contains various mock data and test properties for the DropDownButton component.
 * It is used in unit tests and storybook stories to simulate different scenarios and states of the component.
 */

import type {
  InterfaceDropDownButtonProps,
  InterfaceDropDownOption,
} from 'types/shared-components/DropDownButton/interface';
import { ArrowDownwardSharp } from '@mui/icons-material';
import { vi } from 'vitest';

export const basicOptions: InterfaceDropDownOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

export const optionsWithDisabled: InterfaceDropDownOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2', disabled: true },
  { value: '3', label: 'Option 3' },
];

export const mockOnSelect = vi.fn();

export const baseProps: InterfaceDropDownButtonProps = {
  id: 'test-dropdown',
  options: basicOptions,
  selectedValue: '1',
  onSelect: mockOnSelect,
  ariaLabel: 'Test Dropdown',
  dataTestIdPrefix: 'test-dropdown',
};

export const noSelectionProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  selectedValue: undefined,
  placeholder: 'Choose an option',
};

export const disabledDropdownProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  disabled: true,
};

export const customLabelProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  buttonLabel: 'Custom Button Label',
};

export const withIconProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  icon: <ArrowDownwardSharp fontSize="small" data-testid="dropdown-icon" />,
};

export const styledProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  parentContainerStyle: 'custom-container',
  btnStyle: 'custom-button',
};

export const disabledOptionProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  options: optionsWithDisabled,
};

export const variantProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  variant: 'primary',
};

export const noTestIdProps: InterfaceDropDownButtonProps = {
  id: 'no-test-id-dropdown',
  options: basicOptions,
  selectedValue: '2',
  onSelect: mockOnSelect,
  ariaLabel: 'No Test ID Dropdown',
};

export const dropUpProps: InterfaceDropDownButtonProps = {
  ...baseProps,
  drop: 'up',
};
