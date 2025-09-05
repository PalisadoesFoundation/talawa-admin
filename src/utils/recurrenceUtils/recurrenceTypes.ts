/**
 * Recurrence types for event scheduling
 * Based on RFC 5545 (iCalendar) specification
 */

// Interface for the recurrence rule data that we send to the backend
export interface InterfaceRecurrenceRule {
  frequency: Frequency;
  interval?: number;
  endDate?: Date;
  recurrenceEndDate?: Date;
  count?: number;
  never?: boolean;
  byDay?: WeekDays[];
  byMonth?: number[];
  byMonthDay?: number[];
}

// Recurrence frequency enum
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// Week days enum using RFC 5545 format
export enum WeekDays {
  SU = 'SU',
  MO = 'MO',
  TU = 'TU',
  WE = 'WE',
  TH = 'TH',
  FR = 'FR',
  SA = 'SA',
}

// Recurrence end options
export enum RecurrenceEndOption {
  never = 'never',
  on = 'on',
  after = 'after',
}

// Type for recurrence end option
export type RecurrenceEndOptionType = 'never' | 'on' | 'after';
