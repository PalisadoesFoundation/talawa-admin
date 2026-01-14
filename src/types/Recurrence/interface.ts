import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import type React from 'react';

/**
 * Props interface for the CustomRecurrenceModal component
 */
export interface InterfaceCustomRecurrenceModalProps {
  /** Current recurrence rule state */
  recurrenceRuleState: InterfaceRecurrenceRule;
  /** Function to update recurrence rule state */
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  /** Event end date */
  endDate: Date | null;
  /** Function to set event end date */
  setEndDate: (state: React.SetStateAction<Date | null>) => void;
  /** Whether the custom recurrence modal is open */
  customRecurrenceModalIsOpen: boolean;
  /** Function to hide the custom recurrence modal */
  hideCustomRecurrenceModal: () => void;
  /** Function to set custom recurrence modal open state */
  setCustomRecurrenceModalIsOpen: (
    state: React.SetStateAction<boolean>,
  ) => void;
  /** Translation function */
  t: (key: string) => string;
  /** Event start date */
  startDate: Date;
}
