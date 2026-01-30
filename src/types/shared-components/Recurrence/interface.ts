import React from 'react';
import {
  Frequency,
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
} from '../../../utils/recurrenceUtils';

export interface InterfaceRecurrenceEndOptionsSectionProps {
  frequency: Frequency;
  selectedRecurrenceEndOption: RecurrenceEndOptionType;
  recurrenceRuleState: InterfaceRecurrenceRule;
  localCount: number | string;
  onRecurrenceEndOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setRecurrenceRuleState: (
    state: React.SetStateAction<InterfaceRecurrenceRule>,
  ) => void;
  t: (key: string) => string;
}

export interface InterfaceRecurrenceFrequencySectionProps {
  frequency: Frequency;
  localInterval: number | string;
  onIntervalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFrequencyChange: (newFrequency: Frequency) => void;
  t: (key: string) => string;
}
