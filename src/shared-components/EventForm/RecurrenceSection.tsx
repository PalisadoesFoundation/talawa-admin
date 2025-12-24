/**
 * RecurrenceSection - Component for displaying recurrence options dropdown.
 * @module EventForm/RecurrenceSection
 */
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import styles from 'style/app-fixed.module.css';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

interface IRecurrenceSectionProps {
  recurrenceOptions: Array<{
    label: string;
    value: InterfaceRecurrenceRule | 'custom' | null;
  }>;
  currentRecurrenceLabel: () => string;
  handleRecurrenceSelect: (option: {
    label: string;
    value: InterfaceRecurrenceRule | 'custom' | null;
  }) => void;
  recurrenceDropdownOpen: boolean;
  setRecurrenceDropdownOpen: (open: boolean) => void;
  t: (key: string) => string;
}

/**
 * Component that renders the recurrence dropdown section.
 */
export const RecurrenceSection: React.FC<IRecurrenceSectionProps> = ({
  recurrenceOptions,
  currentRecurrenceLabel,
  handleRecurrenceSelect,
  recurrenceDropdownOpen,
  setRecurrenceDropdownOpen,
  t,
}) => {
  return (
    <div>
      <Dropdown
        show={recurrenceDropdownOpen}
        onToggle={setRecurrenceDropdownOpen}
      >
        <Dropdown.Toggle
          variant="outline-secondary"
          id="recurrence-dropdown"
          data-testid="recurrenceDropdown"
          className={`${styles.dropdown}`}
          aria-label={t('recurring')}
        >
          {currentRecurrenceLabel()}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {recurrenceOptions.map((option, index) => (
            <Dropdown.Item
              key={option.label}
              onClick={() =>
                handleRecurrenceSelect({
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
