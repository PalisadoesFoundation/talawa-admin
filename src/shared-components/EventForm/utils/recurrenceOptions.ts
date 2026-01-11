/**
 * Recurrence options builder for EventForm component.
 */
// translation-check-keyPrefix: organizationEvents
import {
  Frequency,
  WeekDays,
  createDefaultRecurrenceRule,
} from 'utils/recurrenceUtils';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';

/**
 * Represents a recurrence option in the dropdown.
 */
export interface InterfaceRecurrenceOption {
  label: string;
  value: InterfaceRecurrenceRule | 'custom' | null;
}

/**
 * Builds an array of recurrence options based on the event start date.
 * @param startDate - The event start date
 * @param t - Translation function for option labels
 * @returns Array of recurrence options for the dropdown
 */
export const buildRecurrenceOptions = (
  startDate: Date,
  t: (key: string, options?: Record<string, unknown>) => string,
): InterfaceRecurrenceOption[] => {
  const eventDate = new Date(startDate);
  const isValidDate = !Number.isNaN(eventDate.getTime());
  const safeDate = isValidDate ? eventDate : new Date();

  const dayOfWeek = safeDate.getDay();
  const dayOfMonth = safeDate.getDate();
  const month = safeDate.getMonth();

  const locale = navigator.language || 'en-US';
  const dayName = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(new Date(2024, 0, 7 + dayOfWeek));
  const monthName = new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(new Date(2024, month, 1));

  return [
    {
      label: t('doesNotRepeat'),
      value: null,
    },
    {
      label: t('daily'),
      value: createDefaultRecurrenceRule(safeDate, Frequency.DAILY),
    },
    {
      label: t('weeklyOn', { day: dayName }),
      value: createDefaultRecurrenceRule(safeDate, Frequency.WEEKLY),
    },
    {
      label: t('monthlyOnDay', { day: dayOfMonth }),
      value: createDefaultRecurrenceRule(safeDate, Frequency.MONTHLY),
    },
    {
      label: t('annuallyOn', { month: monthName, day: dayOfMonth }),
      value: {
        frequency: Frequency.YEARLY,
        interval: 1,
        byMonth: [month + 1],
        byMonthDay: [dayOfMonth],
        never: true,
      },
    },
    {
      label: t('everyWeekday'),
      value: {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: ['MO', 'TU', 'WE', 'TH', 'FR'] as WeekDays[],
        never: true,
      },
    },
    {
      label: t('custom'),
      value: 'custom',
    },
  ];
};
