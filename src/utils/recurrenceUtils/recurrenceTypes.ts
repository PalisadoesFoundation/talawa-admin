/*
  Recurrence types
*/

// interface for the recurrenceRuleData that we would send to the backend
export interface InterfaceRecurrenceRule {
  frequency: Frequency;
  weekDays: WeekDays[] | undefined;
  interval: number | undefined;
  count: number | undefined;
  weekDayOccurenceInMonth: number | undefined;
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
  ThisInstance = 'ThisInstance',
  ThisAndFollowingInstances = 'ThisAndFollowingInstances',
  AllInstances = 'AllInstances',
}
