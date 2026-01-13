/**
 * RecurrenceDropdown - Sub-component for recurrence pattern selection.
 * Displays dropdown with recurrence options like daily, weekly, monthly, etc.
 */
// translation-check-keyPrefix: organizationEvents
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceOption } from '../utils';

/**
 * Props for the RecurrenceDropdown component.
 */
export interface InterfaceRecurrenceDropdownProps {
  recurrenceOptions: InterfaceRecurrenceOption[];
  currentLabel: string;
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  onSelect: (option: InterfaceRecurrenceOption) => void;
  t: (key: string) => string;
}

/**
 * Renders a dropdown for selecting recurrence patterns.
 * @param props - Component props
 * @returns The recurrence dropdown JSX
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
    <div>
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
              key={option.label}
              onClick={() =>
                onSelect({
                  ...option,
                  value: option.value as
                    | InterfaceRecurrenceRule
                    | 'custom'
                    | null,
                })
              }
              data-testid={`recurrenceOption-${index}`}
            >
              {option.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default RecurrenceDropdown;
