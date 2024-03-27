/*
  Recurrence constants
*/

import { Frequency, RecurrenceEndOption, WeekDays } from './recurrenceTypes';

// recurrence frequency mapping
export const frequencies = {
  [Frequency.DAILY]: 'Day',
  [Frequency.WEEKLY]: 'Week',
  [Frequency.MONTHLY]: 'Month',
  [Frequency.YEARLY]: 'Year',
};

// recurrence days options to select from in the UI
export const daysOptions = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// recurrence days array
export const Days = [
  WeekDays.SU,
  WeekDays.MO,
  WeekDays.TU,
  WeekDays.WE,
  WeekDays.TH,
  WeekDays.FR,
  WeekDays.SA,
];

// recurrence end options array
export const recurrenceEndOptions = [
  RecurrenceEndOption.never,
  RecurrenceEndOption.on,
  RecurrenceEndOption.after,
];

// constants for recurrence end options
export const endsNever = RecurrenceEndOption.never;
export const endsOn = RecurrenceEndOption.on;
export const endsAfter = RecurrenceEndOption.after;

// array of week days containing 'MO' to 'FR
export const mondayToFriday = Days.filter(
  (day) => day !== WeekDays.SA && day !== WeekDays.SU,
);

// names of week days
export const dayNames = {
  [WeekDays.SU]: 'Sunday',
  [WeekDays.MO]: 'Monday',
  [WeekDays.TU]: 'Tuesday',
  [WeekDays.WE]: 'Wednesday',
  [WeekDays.TH]: 'Thursday',
  [WeekDays.FR]: 'Friday',
  [WeekDays.SA]: 'Saturday',
};

// names of months
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
