/**
 * RecurrenceDropdown - Sub-component for recurrence pattern selection.
 * Displays dropdown with recurrence options like daily, weekly, monthly, etc.
 */
// translation-check-keyPrefix: organizationEvents
import React from 'react';
import DropDownButton from 'shared-components/DropDownButton';
import styles from './RecurrenceDropdown.module.css';
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
}) => {
  const options = recurrenceOptions.map((option, index) => ({
    label: option.label,
    value: index.toString(),
  }));

  return (
    <DropDownButton
      options={options}
      buttonLabel={currentLabel}
      onSelect={(value) => onSelect(recurrenceOptions[Number(value)])}
      ariaLabel={t('recurring')}
      dataTestIdPrefix="recurrence"
      variant="outline-secondary"
      btnStyle={styles.dropdown}
    />
  );
};

export default RecurrenceDropdown;
