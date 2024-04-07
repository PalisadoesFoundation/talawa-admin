/*
  Recurrence constants
*/

import {
  Frequency,
  RecurrenceEndOption,
  RecurringEventMutationType,
  WeekDays,
} from './recurrenceTypes';

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
  WeekDays.SUNDAY,
  WeekDays.MONDAY,
  WeekDays.TUESDAY,
  WeekDays.WEDNESDAY,
  WeekDays.THURSDAY,
  WeekDays.FRIDAY,
  WeekDays.SATURDAY,
];

// constants for recurrence end options
export const endsNever = RecurrenceEndOption.never;
export const endsOn = RecurrenceEndOption.on;
export const endsAfter = RecurrenceEndOption.after;

// recurrence end options array
export const recurrenceEndOptions = [endsNever, endsOn, endsAfter];

// different types of updations / deletions on recurring events
export const thisInstance = RecurringEventMutationType.ThisInstance;
export const thisAndFollowingInstances =
  RecurringEventMutationType.ThisAndFollowingInstances;
export const allInstances = RecurringEventMutationType.AllInstances;

export const recurringEventMutationOptions = [
  thisInstance,
  thisAndFollowingInstances,
  allInstances,
];

// array of week days containing 'MO' to 'FR
export const mondayToFriday = Days.filter(
  (day) => day !== WeekDays.SATURDAY && day !== WeekDays.SUNDAY,
);

// names of week days
export const dayNames = {
  [WeekDays.SUNDAY]: 'Sunday',
  [WeekDays.MONDAY]: 'Monday',
  [WeekDays.TUESDAY]: 'Tuesday',
  [WeekDays.WEDNESDAY]: 'Wednesday',
  [WeekDays.THURSDAY]: 'Thursday',
  [WeekDays.FRIDAY]: 'Friday',
  [WeekDays.SATURDAY]: 'Saturday',
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

// week day's occurences in month
export const weekDayOccurences = ['First', 'Second', 'Third', 'Fourth', 'Last'];
