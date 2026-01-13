import type { InterfaceRecurrenceOption } from 'shared-components/EventForm/utils';

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
