/**
 * RecurrenceDropdown - Sub-component for recurrence pattern selection.
 * Displays dropdown with recurrence options like daily, weekly, monthly, etc.
 */
// translation-check-keyPrefix: organizationEvents
import React, { useCallback, useMemo } from 'react';
import DropDownButton from 'shared-components/DropDownButton';
import type { InterfaceRecurrenceDropdownProps } from 'types/shared-components/RecurrenceDropdown/interface';
import type { InterfaceDropDownOption } from 'types/shared-components/DropDownButton/interface';

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
}) => {
  const dropdownOptions: InterfaceDropDownOption[] = useMemo(
    () =>
      recurrenceOptions.map((option, index) => ({
        value: String(index),
        label: option.label,
      })),
    [recurrenceOptions],
  );

  const selectedValue = useMemo(() => {
    const idx = recurrenceOptions.findIndex(
      (opt) => opt.label === currentLabel,
    );
    return idx >= 0 ? String(idx) : undefined;
  }, [recurrenceOptions, currentLabel]);

  const handleSelect = useCallback(
    (value: string) => {
      const index = parseInt(value, 10);
      const option = recurrenceOptions[index];
      if (option) {
        onSelect(option);
      }
    },
    [recurrenceOptions, onSelect],
  );

  return (
    <DropDownButton
      id="recurrence-dropdown"
      options={dropdownOptions}
      selectedValue={selectedValue}
      onSelect={handleSelect}
      buttonLabel={currentLabel}
      variant="outline-secondary"
      ariaLabel={t('recurring')}
      dataTestIdPrefix="recurrence"
    />
  );
};

export default RecurrenceDropdown;
