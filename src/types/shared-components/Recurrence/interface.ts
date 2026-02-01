import React from 'react';
import {
  Frequency,
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
} from '../../../utils/recurrenceUtils';

/**
 * Props for the RecurrenceEndOptionsSection component.
 */
export interface InterfaceRecurrenceEndOptionsSectionProps {
  /** The frequency of the recurrence (e.g., DAILY, WEEKLY). */
  frequency: Frequency;
  /** The currently selected end option (NEVER, ON_DATE, AFTER_OCCURRENCES). */
  selectedRecurrenceEndOption: RecurrenceEndOptionType;
  /** The current state of the recurrence rule being built. */
  recurrenceRuleState: InterfaceRecurrenceRule;
  /** The local count value for "End after X occurrences". */
  localCount: number | string;
  /** Callback when the end option selection changes. */
  onRecurrenceEndOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback when the occurrence count changes. */
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** State setter for the recurrence rule. */
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  /** Translation function. */
  t: (key: string) => string;
}

/**
 * Props for the RecurrenceFrequencySection component.
 */
export interface InterfaceRecurrenceFrequencySectionProps {
  /** The selected frequency usage. */
  frequency: Frequency;
  /** The interval value (e.g., every 2 weeks). */
  localInterval: number | string;
  /** Callback when the interval changes. */
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback when the frequency changes. */
  onFrequencyChange: (newFrequency: Frequency) => void;
  /** Translation function. */
  t: (key: string) => string;
}
