/*
  Recurrence types
*/

// interface for the recurrenceRuleData that we would send to the backend
export interface InterfaceRecurrenceRule {
  frequency: Frequency;
  weekDays: WeekDays[];
  count: number | undefined;
}

// recurrence frequency
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// recurrence frequency mapping
export const frequencies = {
  [Frequency.DAILY]: 'Day',
  [Frequency.WEEKLY]: 'Week',
  [Frequency.MONTHLY]: 'Month',
  [Frequency.YEARLY]: 'Year',
};

// recurrence week days
export enum WeekDays {
  SU = 'SU',
  MO = 'MO',
  TU = 'TU',
  WE = 'WE',
  TH = 'TH',
  FR = 'FR',
  SA = 'SA',
}

// recurrence end options
// i.e. whether it 'never' ends, ends 'on' a certain date, or 'after' a certain number of occurences
export enum RecurrenceEndOption {
  never = 'never',
  on = 'on',
  after = 'after',
}
