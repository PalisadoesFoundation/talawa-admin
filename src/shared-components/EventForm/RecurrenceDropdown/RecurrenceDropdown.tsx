/**
 * RecurrenceDropdown - Sub-component for recurrence pattern selection.
 * Displays dropdown with recurrence options like daily, weekly, monthly, etc.
 */
// translation-check-keyPrefix: organizationEvents
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import type { InterfaceRecurrenceDropdownProps } from 'types/shared-components/RecurrenceDropdown/interface';

/**
 * Renders a dropdown for selecting recurrence patterns.
 * @param props - Component props from InterfaceRecurrenceDropdownProps
 * @returns JSX.Element - The recurrence dropdown component
 */
const RecurrenceDropdown: React.FC<InterfaceRecurrenceDropdownProps> = ({
  recurrenceOptions,
  currentLabel,
  isOpen,
  onToggle,
  onSelect,
  t,
}) => {
  return (
    <Dropdown show={isOpen} onToggle={onToggle}>
      <Dropdown.Toggle
        variant="outline-secondary"
        id="recurrence-dropdown"
        data-testid="recurrenceDropdown"
        className={`${styles.dropdown}`}
        aria-label={t('recurring')}
      >
        {currentLabel}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {recurrenceOptions.map((option, index) => (
          <Dropdown.Item
            key={index}
            onClick={() => onSelect(option)}
            data-testid={`recurrenceOption-${index}`}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RecurrenceDropdown;
