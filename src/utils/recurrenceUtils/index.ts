/**
 * Main export file for recurrence utilities
 * Provides a clean interface for importing recurrence-related functionality
 */

// Export types
export type {
  InterfaceRecurrenceRule,
  RecurrenceEndOptionType,
} from './recurrenceTypes';

// Export enums
export { Frequency, WeekDays, RecurrenceEndOption } from './recurrenceTypes';

// Export constants
export {
  frequencies,
  daysOptions,
  Days,
  recurrenceEndOptions,
  endsNever,
  endsOn,
  endsAfter,
  mondayToFriday,
  dayNames,
  dayShortNames,
  monthNames,
  monthShortNames,
  monthDays,
} from './recurrenceConstants';

// Export utility functions
export {
  validateRecurrenceInput,
  getRecurrenceRuleText,
  getOrdinalSuffix,
  createDefaultRecurrenceRule,
  getEndTypeFromRecurrence,
  areRecurrenceRulesEqual,
  formatRecurrenceForApi,
} from './recurrenceUtilityFunctions';
