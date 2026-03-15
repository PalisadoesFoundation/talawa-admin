import type { InterfaceRecurrenceOption } from 'shared-components/EventForm/utils';

/**
 * Props for the RecurrenceDropdown component.
 */
export interface InterfaceRecurrenceDropdownProps {
  recurrenceOptions: InterfaceRecurrenceOption[];
  currentLabel: string;
  onSelect: (option: InterfaceRecurrenceOption) => void;
  /** If true, the dropdown is disabled (view-only mode) */
  disabled?: boolean;
}
