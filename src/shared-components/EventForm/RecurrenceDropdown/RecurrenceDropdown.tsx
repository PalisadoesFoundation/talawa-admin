/**
 * RecurrenceDropdown - Sub-component for recurrence pattern selection.
 * Displays dropdown with recurrence options like daily, weekly, monthly, etc.
 */
// translation-check-keyPrefix: organizationEvents
import React from 'react';
import DropDownButton from 'shared-components/DropDownButton/DropDownButton';
import type { InterfaceRecurrenceDropdownProps } from 'types/shared-components/RecurrenceDropdown/interface';

/**
 * Renders a dropdown for selecting recurrence patterns.
 * @param props - Component props from InterfaceRecurrenceDropdownProps
 * @returns JSX.Element - The recurrence dropdown component
 */
const RecurrenceDropdown: React.FC<InterfaceRecurrenceDropdownProps> = ({
  recurrenceOptions,
  currentLabel,
  onSelect,
  t,
  disabled = false,
}) => {
  // Map options for DropDownButton (needs string value)
  const dropdownOptions = recurrenceOptions.map((option, index) => ({
    label: option.label,
    value: index.toString(),
  }));

  const handleSelect = (value: string): void => {
    const selectedIndex = parseInt(value, 10);
    const selectedOption = recurrenceOptions[selectedIndex];
    if (selectedOption) {
      onSelect(selectedOption);
    }
  };

  return (
    <DropDownButton
      id="recurrence-dropdown"
      buttonLabel={currentLabel}
      options={dropdownOptions}
      onSelect={handleSelect}
      disabled={disabled}
      ariaLabel={t('recurring')}
      dataTestIdPrefix="recurrence"
      variant="outline-secondary"
      btnStyle="w-100 text-start d-flex justify-content-between align-items-center"
    />
  );
};

export default RecurrenceDropdown;
