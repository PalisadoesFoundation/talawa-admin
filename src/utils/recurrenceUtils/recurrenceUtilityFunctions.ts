/**
 * Recurrence utility functions for event recurrence
 */

import dayjs from 'dayjs';
import {
  InterfaceRecurrenceRule,
  Frequency,
  WeekDays,
  RecurrenceEndOptionType,
} from './recurrenceTypes';
import { dayNames, monthNames, Days } from './recurrenceConstants';

/**
 * Validates recurrence input data
 * @param recurrence - The recurrence rule to validate
 * @param startDate - The event start date
 * @returns Validation result with errors
 */
export const validateRecurrenceInput = (
  recurrence: InterfaceRecurrenceRule,
  startDate: Date,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate interval
  if (
    recurrence.interval !== undefined &&
    recurrence.interval !== null &&
    recurrence.interval < 1
  ) {
    errors.push('Recurrence interval must be at least 1');
  }

  // Validate end conditions
  const endConditions = [
    !!recurrence.never,
    !!recurrence.endDate,
    !!recurrence.count,
  ].filter(Boolean);
  if (endConditions.length !== 1) {
    errors.push(
      'Recurrence must have exactly one end condition (never, end date, or count)',
    );
  }

  if (recurrence.endDate && recurrence.endDate <= startDate) {
    errors.push('Recurrence end date must be after event start date');
  }

  if (recurrence.count !== undefined && recurrence.count !== null) {
    if (recurrence.count < 1) {
      errors.push('Recurrence count must be at least 1');
    }
    if (recurrence.frequency === Frequency.DAILY && recurrence.count > 999) {
      errors.push('Daily recurrence count must be no more than 999');
    }
  }

  // Validate frequency-specific fields
  if (
    recurrence.frequency === Frequency.WEEKLY &&
    (!recurrence.byDay || recurrence.byDay.length === 0)
  ) {
    errors.push('Weekly recurrence must specify at least one day of the week');
  }

  if (
    recurrence.frequency === Frequency.MONTHLY &&
    !recurrence.byMonthDay &&
    !recurrence.byDay
  ) {
    errors.push(
      'Monthly recurrence must specify either a date or weekday pattern',
    );
  }

  if (recurrence.frequency === Frequency.YEARLY) {
    if (!recurrence.byMonth || recurrence.byMonth.length === 0) {
      errors.push('Yearly recurrence must specify at least one month');
    }
    if (
      (!recurrence.byMonthDay || recurrence.byMonthDay.length === 0) &&
      !recurrence.byDay
    ) {
      errors.push(
        'Yearly recurrence must specify at least a day of the month or a weekday pattern',
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generates a human-readable description of the recurrence rule
 * @param recurrence - The recurrence rule
 * @param startDate - The event start date
 * @returns Human-readable description
 */
export const getRecurrenceRuleText = (
  recurrence: InterfaceRecurrenceRule,
  startDate: Date,
  endDate?: Date | null,
): string => {
  let recurrenceRuleText = '';
  const { frequency, interval = 1, byDay, count } = recurrence;

  // Handle interval
  const intervalText = interval === 1 ? '' : `Every ${interval} `; // i18n-ignore-line

  switch (frequency) {
    case Frequency.DAILY:
      recurrenceRuleText = interval === 1 ? 'Daily' : `Every ${interval} days`; // i18n-ignore-line
      break;
    case Frequency.WEEKLY:
      if (byDay && byDay.length > 0) {
        const dayNamesList = getWeekDaysString(byDay);
        recurrenceRuleText = `${intervalText}Weekly on ${dayNamesList}`; // i18n-ignore-line
      } else {
        recurrenceRuleText = `${intervalText}Weekly`; // i18n-ignore-line
      }
      break;
    case Frequency.MONTHLY:
      recurrenceRuleText = `${intervalText}Monthly`; // i18n-ignore-line
      if (recurrence.byMonthDay && recurrence.byMonthDay.length > 0) {
        const dayText = recurrence.byMonthDay
          .map((day) => `${day}${getOrdinalSuffix(day)}`)
          .join(', ');
        recurrenceRuleText += ` on the ${dayText}`; // i18n-ignore-line
      } else {
        recurrenceRuleText += ` on Day ${startDate.getUTCDate()}`; // i18n-ignore-line
      }
      break;
    case Frequency.YEARLY:
      recurrenceRuleText = `${intervalText}Annually`; // i18n-ignore-line
      if (recurrence.byMonth && recurrence.byMonth.length > 0) {
        const monthNamesList = recurrence.byMonth
          .map((m) => monthNames[m - 1])
          .join(', ');
        recurrenceRuleText += ` in ${monthNamesList}`; // i18n-ignore-line
      } else {
        recurrenceRuleText += ` in ${monthNames[startDate.getUTCMonth()]}`; // i18n-ignore-line
      }

      if (recurrence.byMonthDay && recurrence.byMonthDay.length > 0) {
        const dayText = recurrence.byMonthDay
          .map((day) => `${day}${getOrdinalSuffix(day)}`)
          .join(', ');
        recurrenceRuleText += ` on the ${dayText}`; // i18n-ignore-line
      } else {
        recurrenceRuleText += ` on the ${startDate.getUTCDate()}${getOrdinalSuffix(startDate.getUTCDate())}`; // i18n-ignore-line
      }
      break;
  }

  // Add end condition information
  if (endDate) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    recurrenceRuleText += `, until ${endDate.toLocaleDateString('en-US', options)}`; // i18n-ignore-line
  }

  if (count) {
    recurrenceRuleText += `, ${count} time${count !== 1 ? 's' : ''}`; // i18n-ignore-line
  }

  if (recurrence.never) {
    recurrenceRuleText += ', never ends'; // i18n-ignore-line
  }

  return recurrenceRuleText;
};

/**
 * Generates a string of selected week days for display
 * @param weekDays - Array of selected week days
 * @returns Formatted string of day names
 */
const getWeekDaysString = (weekDays: WeekDays[]): string => {
  const fullDayNames = weekDays.map((day) => dayNames[day]);

  if (fullDayNames.length === 1) {
    return fullDayNames[0];
  }

  if (fullDayNames.length === 2) {
    return fullDayNames.join(' and '); // i18n-ignore-line
  }

  let weekDaysString = fullDayNames.slice(0, -1).join(', ');
  weekDaysString += ` and ${fullDayNames[fullDayNames.length - 1]}`; // i18n-ignore-line

  return weekDaysString;
};

/**
 * Gets ordinal suffix for a number (st, nd, rd, th)
 * @param num - The number
 * @returns Ordinal suffix
 */
export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

/**
 * Creates a default recurrence rule based on the event start date
 * @param startDate - The event start date
 * @param frequency - The desired frequency
 * @returns Default recurrence rule
 */
export const createDefaultRecurrenceRule = (
  startDate: Date,
  frequency: Frequency,
): InterfaceRecurrenceRule => {
  const weekDayByJs = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  const rule: InterfaceRecurrenceRule = {
    frequency,
    interval: 1,
    never: true, // Default to never-ending
  };

  switch (frequency) {
    case Frequency.WEEKLY:
      rule.byDay = [weekDayByJs[startDate.getUTCDay()] as WeekDays];
      break;
    case Frequency.MONTHLY:
      rule.byMonthDay = [startDate.getUTCDate()];
      break;
    case Frequency.YEARLY:
      rule.byMonth = [startDate.getUTCMonth() + 1];
      rule.byMonthDay = [startDate.getUTCDate()];
      break;
    case Frequency.DAILY:
    default:
      // No additional fields needed for daily
      break;
  }

  return rule;
};

/**
 * Determines the end type from a recurrence rule
 * @param recurrence - The recurrence rule
 * @returns The end type
 */
export const getEndTypeFromRecurrence = (
  recurrence: InterfaceRecurrenceRule | null,
): RecurrenceEndOptionType => {
  if (!recurrence) return 'never';
  if (recurrence.never) return 'never';
  if (recurrence.endDate) return 'on';
  if (recurrence.count) return 'after';
  return 'never';
};

/**
 * Checks if two recurrence rules are equal
 * @param rule1 - First recurrence rule
 * @param rule2 - Second recurrence rule
 * @returns True if rules are equal
 */
export const areRecurrenceRulesEqual = (
  rule1: InterfaceRecurrenceRule | null,
  rule2: InterfaceRecurrenceRule | null,
): boolean => {
  if (!rule1 && !rule2) return true;
  if (!rule1 || !rule2) return false;

  return (
    rule1.frequency === rule2.frequency &&
    rule1.interval === rule2.interval &&
    rule1.never === rule2.never &&
    rule1.count === rule2.count &&
    rule1.endDate?.getTime() === rule2.endDate?.getTime() &&
    JSON.stringify(rule1.byDay?.sort()) ===
      JSON.stringify(rule2.byDay?.sort()) &&
    JSON.stringify(rule1.byMonth?.sort()) ===
      JSON.stringify(rule2.byMonth?.sort()) &&
    JSON.stringify(rule1.byMonthDay?.sort()) ===
      JSON.stringify(rule2.byMonthDay?.sort())
  );
};

/**
 * Formats a recurrence rule for API submission.
 * Converts Date object to ISO string for `endDate`.
 * @param recurrence - The recurrence rule to format.
 * @returns A recurrence rule object suitable for API submission.
 */
export const formatRecurrenceForApi = (
  recurrence: InterfaceRecurrenceRule,
): Omit<InterfaceRecurrenceRule, 'endDate'> & { endDate?: string } => {
  const { endDate, ...rest } = recurrence;

  if (endDate) {
    return {
      ...rest,
      endDate: dayjs(endDate).toISOString(),
    };
  }

  return rest;
};

/**
 * Calculates which week of the month a given date falls in (calendar row), using UTC.
 * @param date - The date to calculate the week for
 * @returns The week number (1-6) within the month
 */
export const getWeekOfMonth = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const firstDay = new Date(Date.UTC(year, month, 1));
  const weekNumber = Math.ceil((date.getUTCDate() + firstDay.getUTCDay()) / 7);
  return weekNumber;
};

/**
 * Returns which occurrence (1st, 2nd, 3rd, etc., or last) of the given weekday
 * the date is within the month (UTC). Used for "Monthly on the third Monday" style labels.
 * Uses UTC to avoid timezone drift and flakiness across environments (CI TZ=UTC vs local).
 * Returns 6 when the date is the last occurrence of that weekday in the month
 * (i.e. date + 7 days crosses the month boundary).
 * @param date - The date to check
 * @returns Occurrence index 1-5, or 6 for "last" when date+7 days crosses month boundary
 */
const getWeekdayOccurrenceInMonth = (date: Date): number => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const dayOfWeek = date.getUTCDay();
  const dayOfMonth = date.getUTCDate();
  let count = 0;
  for (let d = 1; d <= dayOfMonth; d++) {
    const utcDate = new Date(Date.UTC(year, month, d));
    if (utcDate.getUTCDay() === dayOfWeek) {
      count++;
    }
  }
  // Last occurrence: date + 7 days crosses month boundary (issue #6966)
  const plusSeven = new Date(Date.UTC(year, month, dayOfMonth + 7));
  if (plusSeven.getUTCMonth() !== month) {
    return 6;
  }
  return count;
};

/**
 * Converts a number to its ordinal string representation
 * @param num - The number to convert (1-5)
 * @returns The ordinal string (e.g., "first", "second", etc.)
 */
export const getOrdinalString = (num: number): string => {
  const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
  return ordinals[num] || 'last';
};

/**
 * Gets the full day name from a day index
 * @param dayIndex - The day index (0-6, where 0 is Sunday)
 * @returns The full day name
 */
export const getDayName = (dayIndex: number): string => {
  return dayNames[Days[dayIndex]];
};

/**
 * Generates monthly recurrence options based on the start date
 * @param startDate - The event start date
 * @returns Object containing monthly recurrence display strings and values
 */
export const getMonthlyOptions = (startDate: Date) => {
  const eventDate = new Date(startDate);
  const dayOfMonth = eventDate.getUTCDate();
  const dayOfWeek = eventDate.getUTCDay();
  const weekdayOccurrence = getWeekdayOccurrenceInMonth(eventDate);

  return {
    byDate: `Monthly on day ${dayOfMonth}`, // i18n-ignore-line
    byWeekday: `Monthly on the ${getOrdinalString(weekdayOccurrence)} ${getDayName(dayOfWeek)}`, // i18n-ignore-line
    dateValue: dayOfMonth,
    weekdayValue: { week: weekdayOccurrence, day: Days[dayOfWeek] },
  };
};
