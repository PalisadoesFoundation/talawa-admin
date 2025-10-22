/**
 * Recurrence constants and data for UI components
 */

import { Frequency, RecurrenceEndOption, WeekDays } from './recurrenceTypes';

// Recurrence frequency mapping for display
export const frequencies = {
  [Frequency.DAILY]: 'Daily',
  [Frequency.WEEKLY]: 'Weekly',
  [Frequency.MONTHLY]: 'Monthly',
  [Frequency.YEARLY]: 'Yearly',
};

// Recurrence days options for UI display
export const daysOptions = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// Week days array in order
export const Days = [
  WeekDays.SU,
  WeekDays.MO,
  WeekDays.TU,
  WeekDays.WE,
  WeekDays.TH,
  WeekDays.FR,
  WeekDays.SA,
];

// Recurrence end options array
export const recurrenceEndOptions = [
  RecurrenceEndOption.never,
  RecurrenceEndOption.on,
  RecurrenceEndOption.after,
];

// Constants for recurrence end options
export const endsNever = RecurrenceEndOption.never;
export const endsOn = RecurrenceEndOption.on;
export const endsAfter = RecurrenceEndOption.after;

// Array of weekdays Monday to Friday
const mondayToFriday = Days.filter(
  (day) => day !== WeekDays.SA && day !== WeekDays.SU,
);

// Names of week days for display
export const dayNames = {
  [WeekDays.SU]: 'Sunday',
  [WeekDays.MO]: 'Monday',
  [WeekDays.TU]: 'Tuesday',
  [WeekDays.WE]: 'Wednesday',
  [WeekDays.TH]: 'Thursday',
  [WeekDays.FR]: 'Friday',
  [WeekDays.SA]: 'Saturday',
};

// Short names for week days
const dayShortNames = {
  [WeekDays.SU]: 'S',
  [WeekDays.MO]: 'M',
  [WeekDays.TU]: 'T',
  [WeekDays.WE]: 'W',
  [WeekDays.TH]: 'T',
  [WeekDays.FR]: 'F',
  [WeekDays.SA]: 'S',
};

// Names of months
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Short names of months
const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Days in month (1-31)
const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
