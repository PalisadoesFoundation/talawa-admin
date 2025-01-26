/*
  Recurrence types
*/

// interface for the recurrenceRuleStateData that would be sent to the backend
export interface InterfaceRecurrenceRuleState {
  recurrenceStartDate: Date;
  recurrenceEndDate: Date | null;
  frequency: Frequency;
  weekDays: WeekDays[];
  interval: number;
  count: number | undefined;
  weekDayOccurenceInMonth: number | undefined;
}

// interface for the RecurrenceRule document that would be fetched from the backend
export interface InterfaceRecurrenceRule {
  recurrenceStartDate: string;
  recurrenceEndDate: string | null;
  frequency: Frequency;
  weekDays: WeekDays[];
  interval: number;
  count: number | null;
  weekDayOccurenceInMonth: number | null;
}

// recurrence frequency
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// recurrence week days
export enum WeekDays {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

// recurrence end options
// i.e. whether it 'never' ends, ends 'on' a certain date, or 'after' a certain number of occurences
export enum RecurrenceEndOption {
  never = 'never',
  on = 'on',
  after = 'after',
}

// update / delete options of recurring events
export enum RecurringEventMutationType {
  thisInstance = 'thisInstance',
  thisAndFollowingInstances = 'thisAndFollowingInstances',
  allInstances = 'allInstances',
}
