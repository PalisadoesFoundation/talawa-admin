import type { InterfaceRecurrenceOption } from 'shared-components/EventForm/utils';

/**
 * Props for the RecurrenceDropdown component.
 */
export interface InterfaceRecurrenceDropdownProps {
  recurrenceOptions: InterfaceRecurrenceOption[];
  currentLabel: string;
  onSelect: (option: InterfaceRecurrenceOption) => void;
  t: (key: string) => string;
}
