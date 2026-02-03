import {
  validateRecurrenceInput,
  getRecurrenceRuleText,
  getOrdinalSuffix,
  createDefaultRecurrenceRule,
  getEndTypeFromRecurrence,
  areRecurrenceRulesEqual,
  formatRecurrenceForApi,
  getWeekOfMonth,
  getOrdinalString,
  getDayName,
  getMonthlyOptions,
} from './recurrenceUtilityFunctions';
import {
  Frequency,
  type InterfaceRecurrenceRule,
  WeekDays,
} from './recurrenceTypes';
import { describe, it, expect, vi, afterEach } from 'vitest';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

// WeekDays mapping for assertions
const dayIndexToWeekDay = [
  WeekDays.SU,
  WeekDays.MO,
  WeekDays.TU,
  WeekDays.WE,
  WeekDays.TH,
  WeekDays.FR,
  WeekDays.SA,
];

// Helper functions to find specific dates dynamically (UTC only)
// Find a leap year Feb 29 (current or next)
const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const findLeapYearFeb29 = (): dayjs.Dayjs => {
  let year = dayjs.utc().year();
  if (dayjs.utc().month() < 2 && isLeapYear(year)) {
    return dayjs(`${year}-02-29T10:00:00.000Z`);
  }

  if (dayjs.utc().month() >= 2) {
    year++;
  }
  while (!isLeapYear(year)) {
    year++;
  }
  return dayjs(`${year}-02-29T10:00:00.000Z`);
};

// Get a future month for testing (UTC only)
const getFutureMonth = (monthsAhead = 2): dayjs.Dayjs => {
  return dayjs.utc().add(monthsAhead, 'month').startOf('month');
};

// Returns a future month where the 1st is Tuesday (day() === 2), for deterministic week numbers
const getMonthWithFirstDayTuesday = (): dayjs.Dayjs => {
  let d = dayjs.utc().add(1, 'month').startOf('month');
  while (d.day() !== 2) {
    d = d.add(1, 'month');
  }
  return d;
};

// Get the nth occurrence of a weekday in a month (UTC)
const getNthDayOfWeekInMonth = (
  yearMonth: dayjs.Dayjs,
  dayOfWeek: number,
  nthOccurrence: number,
): dayjs.Dayjs => {
  const base = yearMonth.utc();
  let count = 0;
  for (let day = 1; day <= base.daysInMonth(); day++) {
    const date = base.date(day).hour(10);
    if (date.day() === dayOfWeek) {
      count++;
      if (count === nthOccurrence) return date;
    }
  }
  return base.date(1).hour(10);
};

// Get day name from dayjs day() value
const getDayNameFromIndex = (index: number): string => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[index];
};

describe('Recurrence Utility Functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Use a dynamic date for general tests (UTC only)
  const startDate = dayjs
    .utc()
    .add(30, 'days')
    .hour(10)
    .minute(0)
    .second(0)
    .millisecond(0)
    .toDate();

  describe('validateRecurrenceInput', () => {
    it('should return valid for a correct recurrence rule', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(true);
      expect(errors).toHaveLength(0);
    });

    it('should return invalid if interval is less than 1', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 0,
        never: true,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain('Recurrence interval must be at least 1');
    });

    it('should return invalid if more than one end condition is specified', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
        count: 5,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Recurrence must have exactly one end condition (never, end date, or count)',
      );
    });

    it('should return invalid if endDate is before startDate', () => {
      // Create an endDate that is before the startDate
      const pastEndDate = dayjs
        .utc(startDate.toISOString())
        .subtract(1, 'day')
        .toDate();
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate: pastEndDate,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Recurrence end date must be after event start date',
      );
    });

    it('should return invalid if weekly recurrence has no days specified', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        never: true,
        byDay: [],
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Weekly recurrence must specify at least one day of the week',
      );
    });

    it('should return invalid if yearly recurrence has no month specified', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
        byMonth: [],
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Yearly recurrence must specify at least one month',
      );
    });

    it('should return invalid if recurrence count is less than 1', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        count: 0,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain('Recurrence count must be at least 1');
    });

    it('should return invalid if daily recurrence count is more than 999', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        count: 1000,
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Daily recurrence count must be no more than 999',
      );
    });

    it('should return invalid if monthly recurrence has neither byMonthDay nor byDay', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
        // No byMonthDay and no byDay
      };
      const { isValid, errors } = validateRecurrenceInput(rule, startDate);
      expect(isValid).toBe(false);
      expect(errors).toContain(
        'Monthly recurrence must specify either a date or weekday pattern',
      );
    });
  });

  describe('getRecurrenceRuleText', () => {
    it('should generate correct text for daily recurrence', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Daily, never ends');
    });

    it('should generate correct text for weekly recurrence', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [WeekDays.MO, WeekDays.WE, WeekDays.FR],
        count: 10,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Weekly on Monday, Wednesday and Friday, 10 times');
    });

    it('should generate correct text for monthly recurrence with end date', () => {
      // Use a dynamic end date 1 year in the future
      const futureEndDate = dayjs
        .utc()
        .add(1, 'year')
        .hour(10)
        .minute(0)
        .second(0)
        .millisecond(0);
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.MONTHLY,
        interval: 1,
        byMonthDay: [15],
        endDate: futureEndDate.toDate(),
      };
      const text = getRecurrenceRuleText(
        rule,
        startDate,
        futureEndDate.toDate(),
      );
      // Check that it contains the expected format with dynamic date
      expect(text).toContain('Monthly on the 15th, until');
      expect(text).toContain(futureEndDate.format('YYYY'));
    });

    it('should generate correct text for yearly recurrence', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.YEARLY,
        interval: 1,
        byMonth: [7],
        byMonthDay: [21],
        count: 5,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Annually in July on the 21st, 5 times');
    });

    it('should generate correct text for weekly recurrence without specified days', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 2,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Every 2 Weekly, never ends');
    });

    it('should generate correct text for monthly recurrence without specified day of month', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      const expectedDay = startDate.getUTCDate();
      expect(text).toBe(`Monthly on Day ${expectedDay}, never ends`);
    });

    it('should generate correct text for yearly recurrence without specified month or day', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      const monthNamesForRule = [
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
      const expectedMonthName = monthNamesForRule[startDate.getUTCMonth()];
      const expectedDay = startDate.getUTCDate();
      const expectedSuffix = getOrdinalSuffix(expectedDay);
      expect(text).toBe(
        `Annually in ${expectedMonthName} on the ${expectedDay}${expectedSuffix}, never ends`,
      );
    });

    it('should generate correct text for weekly recurrence with single day', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [WeekDays.MO],
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Weekly on Monday, never ends');
    });

    it('should generate correct text for weekly recurrence with exactly two days', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [WeekDays.MO, WeekDays.FR],
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Weekly on Monday and Friday, never ends');
    });

    it('should use "Weekly" only (no days) when weekly recurrence has empty byDay', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [],
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Weekly, never ends');
    });

    it('should use "on Day N" when monthly recurrence has no byMonthDay', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe(`Monthly on Day ${startDate.getUTCDate()}, never ends`);
    });

    it('should append "until <date>" when recurrence has endDate', () => {
      const endDate = dayjs.utc().add(1, 'year').toDate();
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate,
      };
      const text = getRecurrenceRuleText(rule, startDate, endDate);
      expect(text).toContain('Daily');
      expect(text).toContain('until');
      expect(text).toContain(
        endDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      );
    });
  });

  describe('getOrdinalSuffix', () => {
    it('should return "st" for 1, 21, 31', () => {
      expect(getOrdinalSuffix(1)).toBe('st');
      expect(getOrdinalSuffix(21)).toBe('st');
      expect(getOrdinalSuffix(31)).toBe('st');
    });

    it('should return "nd" for 2, 22', () => {
      expect(getOrdinalSuffix(2)).toBe('nd');
      expect(getOrdinalSuffix(22)).toBe('nd');
    });

    it('should return "rd" for 3, 23', () => {
      expect(getOrdinalSuffix(3)).toBe('rd');
      expect(getOrdinalSuffix(23)).toBe('rd');
    });

    it('should return "th" for 4, 11, 12, 13', () => {
      expect(getOrdinalSuffix(4)).toBe('th');
      expect(getOrdinalSuffix(11)).toBe('th');
      expect(getOrdinalSuffix(12)).toBe('th');
      expect(getOrdinalSuffix(13)).toBe('th');
    });
  });

  describe('createDefaultRecurrenceRule', () => {
    it('should create a default daily rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.DAILY);
      expect(rule).toEqual({
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      });
    });

    it('should create a default weekly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.WEEKLY);
      const expectedDay = dayIndexToWeekDay[startDate.getUTCDay()];
      expect(rule).toEqual({
        frequency: Frequency.WEEKLY,
        interval: 1,
        never: true,
        byDay: [expectedDay],
      });
    });

    it('should create a default monthly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.MONTHLY);
      const expectedDay = startDate.getUTCDate();
      expect(rule).toEqual({
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
        byMonthDay: [expectedDay],
      });
    });

    it('should create a default yearly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.YEARLY);
      const expectedMonth = startDate.getUTCMonth() + 1;
      const expectedDay = startDate.getUTCDate();
      expect(rule).toEqual({
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
        byMonth: [expectedMonth],
        byMonthDay: [expectedDay],
      });
    });
  });

  describe('getEndTypeFromRecurrence', () => {
    it('should return "never" for a rule with never: true', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      expect(getEndTypeFromRecurrence(rule)).toBe('never');
    });

    it('should return "on" for a rule with an endDate', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate: new Date(),
      };
      expect(getEndTypeFromRecurrence(rule)).toBe('on');
    });

    it('should return "after" for a rule with a count', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        count: 5,
      };
      expect(getEndTypeFromRecurrence(rule)).toBe('after');
    });

    it('should return "never" for a null rule', () => {
      expect(getEndTypeFromRecurrence(null)).toBe('never');
    });

    it('should return "never" as default when rule has no end conditions', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        // No never, no endDate, no count
      };
      expect(getEndTypeFromRecurrence(rule)).toBe('never');
    });
  });

  describe('areRecurrenceRulesEqual', () => {
    it('should return true for two identical rules', () => {
      const rule1: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 2,
        byDay: [WeekDays.MO, WeekDays.FR],
        count: 10,
      };
      const rule2: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 2,
        byDay: [WeekDays.FR, WeekDays.MO],
        count: 10,
      };
      expect(areRecurrenceRulesEqual(rule1, rule2)).toBe(true);
    });

    it('should return false for two different rules', () => {
      const rule1: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 2,
        byDay: [WeekDays.MO, WeekDays.FR],
        count: 10,
      };
      const rule2: InterfaceRecurrenceRule = {
        frequency: Frequency.WEEKLY,
        interval: 1,
        byDay: [WeekDays.MO, WeekDays.FR],
        count: 10,
      };
      expect(areRecurrenceRulesEqual(rule1, rule2)).toBe(false);
    });

    it('should return true for two null rules', () => {
      expect(areRecurrenceRulesEqual(null, null)).toBe(true);
    });

    it('should return false for one null rule', () => {
      const rule1: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      expect(areRecurrenceRulesEqual(rule1, null)).toBe(false);
    });
  });

  describe('formatRecurrenceForApi', () => {
    it('should format a rule with an endDate correctly', () => {
      // Use a dynamic future end date
      const futureEndDate = dayjs
        .utc()
        .add(6, 'months')
        .hour(12)
        .minute(0)
        .second(0)
        .millisecond(0);
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate: futureEndDate.toDate(),
      };
      const formattedRule = formatRecurrenceForApi(rule);
      expect(formattedRule.endDate).toBe(futureEndDate.toISOString());
    });

    it('should format a rule without an endDate correctly', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        never: true,
      };
      const formattedRule = formatRecurrenceForApi(rule);
      expect(formattedRule.endDate).toBeUndefined();
    });
  });

  describe('getWeekOfMonth', () => {
    // Month where 1st is Tuesday (UTC) so expected week numbers are deterministic
    const testMonth = getMonthWithFirstDayTuesday();

    it('should return correct week for day 5 of the month', () => {
      const date = testMonth.date(5).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(1);
    });
    it('should return correct week for day 8 of the month', () => {
      const date = testMonth.date(8).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(2);
    });
    it('should return correct week for day 15 of the month', () => {
      const date = testMonth.date(15).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(3);
    });
    it('should return correct week for day 22 of the month', () => {
      const date = testMonth.date(22).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(4);
    });
    it('should return correct week for day 29 of the month', () => {
      const date = testMonth.date(29).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle dates at the end of the month correctly', () => {
      const lastDay = testMonth.endOf('month').hour(10).toDate();
      expect(getWeekOfMonth(lastDay)).toBe(5);
    });

    it('should handle February correctly', () => {
      let year = dayjs.utc().year();
      if (dayjs.utc().month() >= 2) year++;
      const febDate = dayjs(`${year}-02-28T10:00:00.000Z`).toDate();
      expect(getWeekOfMonth(febDate)).toBeGreaterThanOrEqual(4);
    });

    it('should handle February correctly in leap year (29 days)', () => {
      const feb29 = findLeapYearFeb29().toDate();
      expect(getWeekOfMonth(feb29)).toBe(5);
    });

    it('should handle months starting on different days of the week', () => {
      const month1 = getFutureMonth(1).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month1)).toBe(1);

      const month2 = getFutureMonth(2).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month2)).toBe(1);

      const month3 = getFutureMonth(3).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month3)).toBe(1);
    });

    it('should handle different years correctly', () => {
      // Pre-validated: Jan 15, 2025 (Wed) → week 3; Jan 15, 2026 (Thu) → week 3; Jan 15, 2027 (Fri) → week 3
      const testCases = [
        { date: new Date(Date.UTC(2025, 0, 15, 10)), expectedWeek: 3 },
        { date: new Date(Date.UTC(2026, 0, 15, 10)), expectedWeek: 3 },
        { date: new Date(Date.UTC(2027, 0, 15, 10)), expectedWeek: 3 },
      ];
      testCases.forEach(({ date, expectedWeek }) => {
        expect(getWeekOfMonth(date)).toBe(expectedWeek);
      });
    });

    it('should handle edge case: date in the middle of the month', () => {
      const date = testMonth.date(15).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(3);
    });
  });

  describe('getOrdinalString', () => {
    it('should return "first" for 1', () => {
      expect(getOrdinalString(1)).toBe('first');
    });

    it('should return "second" for 2', () => {
      expect(getOrdinalString(2)).toBe('second');
    });

    it('should return "third" for 3', () => {
      expect(getOrdinalString(3)).toBe('third');
    });

    it('should return "fourth" for 4', () => {
      expect(getOrdinalString(4)).toBe('fourth');
    });

    it('should return "fifth" for 5', () => {
      expect(getOrdinalString(5)).toBe('fifth');
    });

    it('should return "last" for numbers greater than 5', () => {
      expect(getOrdinalString(6)).toBe('last');
      expect(getOrdinalString(7)).toBe('last');
      expect(getOrdinalString(10)).toBe('last');
      expect(getOrdinalString(100)).toBe('last');
    });

    it('should return "last" for 0', () => {
      expect(getOrdinalString(0)).toBe('last');
    });

    it('should return "last" for negative numbers', () => {
      expect(getOrdinalString(-1)).toBe('last');
      expect(getOrdinalString(-5)).toBe('last');
    });

    it('should handle all valid range values correctly', () => {
      const expected = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
      for (let i = 1; i <= 5; i++) {
        expect(getOrdinalString(i)).toBe(expected[i]);
      }
    });
  });

  describe('getDayName', () => {
    it('should return "Sunday" for day index 0', () => {
      expect(getDayName(0)).toBe('Sunday');
    });

    it('should return "Monday" for day index 1', () => {
      expect(getDayName(1)).toBe('Monday');
    });

    it('should return "Tuesday" for day index 2', () => {
      expect(getDayName(2)).toBe('Tuesday');
    });

    it('should return "Wednesday" for day index 3', () => {
      expect(getDayName(3)).toBe('Wednesday');
    });

    it('should return "Thursday" for day index 4', () => {
      expect(getDayName(4)).toBe('Thursday');
    });

    it('should return "Friday" for day index 5', () => {
      expect(getDayName(5)).toBe('Friday');
    });

    it('should return "Saturday" for day index 6', () => {
      expect(getDayName(6)).toBe('Saturday');
    });

    it('should handle all valid day indices (0-6)', () => {
      const expectedDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      for (let i = 0; i <= 6; i++) {
        expect(getDayName(i)).toBe(expectedDays[i]);
      }
    });

    it('should return undefined for out of range indices', () => {
      // Days array has 7 elements (0-6), accessing beyond returns undefined
      expect(getDayName(7)).toBeUndefined();
      expect(getDayName(-1)).toBeUndefined();
    });
  });

  describe('getMonthlyOptions', () => {
    // Use UTC-based dates so getMonthlyOptions (which uses UTC) is stable across TZ
    const testMonth = getFutureMonth(2);

    it('should return correct options for a date in the middle of the month', () => {
      const thirdMonday = getNthDayOfWeekInMonth(testMonth, 1, 3); // 1 = Monday, 3 = third occurrence
      const options = getMonthlyOptions(thirdMonday.toDate());
      const dayOfMonth = thirdMonday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      // Implementation uses occurrence (1st, 2nd, 3rd Monday), not week-of-month index
      const expectedOccurrence = 3;
      expect(options.byWeekday).toBe(
        `Monthly on the ${getOrdinalString(expectedOccurrence)} Monday`,
      );
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({
        week: expectedOccurrence,
        day: WeekDays.MO,
      });
    });

    it('should return correct options for the first day of the month', () => {
      const firstDay = testMonth.date(1).hour(10);
      const dayOfWeek = firstDay.day();
      const dayName = getDayNameFromIndex(dayOfWeek);
      const options = getMonthlyOptions(firstDay.toDate());

      expect(options.byDate).toBe('Monthly on day 1');
      expect(options.byWeekday).toBe(`Monthly on the first ${dayName}`);
      expect(options.dateValue).toBe(1);
      expect(options.weekdayValue).toEqual({
        week: 1,
        day: dayIndexToWeekDay[dayOfWeek],
      });
    });

    it('should return correct options for a date in the fifth week', () => {
      const day29 = testMonth.date(29).hour(10);
      const dayOfWeek = day29.day();
      const dayName = getDayNameFromIndex(dayOfWeek);
      const options = getMonthlyOptions(day29.toDate());
      // Day 29 + 7 crosses month boundary → last occurrence (week 6)
      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe(`Monthly on the last ${dayName}`);
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({
        week: 6,
        day: dayIndexToWeekDay[dayOfWeek],
      });
    });

    it('should return correct options for a date in the first week', () => {
      const firstFriday = getNthDayOfWeekInMonth(testMonth, 5, 1); // 5 = Friday
      const options = getMonthlyOptions(firstFriday.toDate());
      const dayOfMonth = firstFriday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the first Friday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 1, day: WeekDays.FR });
    });

    it('should return correct options for a date in the second week', () => {
      const secondWednesday = getNthDayOfWeekInMonth(testMonth, 3, 2); // 3 = Wednesday
      const options = getMonthlyOptions(secondWednesday.toDate());
      const dayOfMonth = secondWednesday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the second Wednesday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 2, day: WeekDays.WE });
    });

    it('should return correct options for a date in the fourth week', () => {
      const fourthThursday = getNthDayOfWeekInMonth(testMonth, 4, 4); // 4 = Thursday
      const options = getMonthlyOptions(fourthThursday.toDate());
      const dayOfMonth = fourthThursday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the fourth Thursday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.TH });
    });

    it('should return correct options for a Sunday', () => {
      const fourthSunday = getNthDayOfWeekInMonth(testMonth, 0, 4); // 0 = Sunday
      const options = getMonthlyOptions(fourthSunday.toDate());
      const dayOfMonth = fourthSunday.date();
      // When fourth Sunday + 7 crosses month boundary it is "last" (week 6)
      const isLast = dayOfMonth + 7 > testMonth.daysInMonth();
      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe(
        isLast ? 'Monthly on the last Sunday' : 'Monthly on the fourth Sunday',
      );
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({
        week: isLast ? 6 : 4,
        day: WeekDays.SU,
      });
    });

    it('should return correct options for a Saturday', () => {
      const fourthSaturday = getNthDayOfWeekInMonth(testMonth, 6, 4); // 6 = Saturday
      const options = getMonthlyOptions(fourthSaturday.toDate());
      const dayOfMonth = fourthSaturday.date();
      const isLast = dayOfMonth + 7 > fourthSaturday.daysInMonth();
      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe(
        isLast
          ? 'Monthly on the last Saturday'
          : 'Monthly on the fourth Saturday',
      );
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({
        week: isLast ? 6 : 4,
        day: WeekDays.SA,
      });
    });

    it('should handle February correctly', () => {
      let year = dayjs.utc().year();
      if (dayjs.utc().month() >= 2) year++;
      const febMonth = dayjs.utc(`${year}-02-01T00:00:00.000Z`);
      const thirdWednesday = getNthDayOfWeekInMonth(febMonth, 3, 3);
      const options = getMonthlyOptions(thirdWednesday.toDate());
      const dayOfMonth = thirdWednesday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the third Wednesday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 3, day: WeekDays.WE });
    });

    it('should handle February in leap year correctly (29 days)', () => {
      const feb29 = findLeapYearFeb29(); // returns dayjs with ISO Z
      const d = feb29.toDate();
      const options = getMonthlyOptions(d);
      const dayOfWeek = d.getUTCDay();
      const dayName = getDayNameFromIndex(dayOfWeek);
      // Feb 29 + 7 crosses month boundary → last occurrence (week 6)
      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe(`Monthly on the last ${dayName}`);
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({
        week: 6,
        day: dayIndexToWeekDay[dayOfWeek],
      });
    });

    it('should handle different months correctly', () => {
      const month1 = getFutureMonth(1).date(15).hour(10).toDate();
      const month2 = getFutureMonth(2).date(15).hour(10).toDate();
      const month3 = getFutureMonth(3).date(15).hour(10).toDate();

      expect(getMonthlyOptions(month1).dateValue).toBe(15);
      expect(getMonthlyOptions(month2).dateValue).toBe(15);
      expect(getMonthlyOptions(month3).dateValue).toBe(15);
    });

    it('should return consistent weekday values for the same day of week', () => {
      const monday1 = getNthDayOfWeekInMonth(testMonth, 1, 1).toDate();
      const monday2 = getNthDayOfWeekInMonth(testMonth, 1, 2).toDate();
      const monday3 = getNthDayOfWeekInMonth(testMonth, 1, 3).toDate();

      expect(getMonthlyOptions(monday1).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday2).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday3).weekdayValue.day).toBe(WeekDays.MO);

      // Implementation uses occurrence (1st, 2nd, 3rd Monday), not week-of-month index
      expect(getMonthlyOptions(monday1).weekdayValue.week).toBe(1);
      expect(getMonthlyOptions(monday2).weekdayValue.week).toBe(2);
      expect(getMonthlyOptions(monday3).weekdayValue.week).toBe(3);
    });

    it('should handle edge case: date that falls in the fifth week', () => {
      const fifthMonday = getNthDayOfWeekInMonth(testMonth, 1, 5);
      const testDate =
        fifthMonday.date() > 7 ? fifthMonday : testMonth.date(29).hour(10);
      const options = getMonthlyOptions(testDate.toDate());
      // When date+7 crosses month boundary we get "last" (week 6), else 5
      const isLast = testDate.date() + 7 > testMonth.daysInMonth();
      expect(options.dateValue).toBe(testDate.date());
      expect(options.weekdayValue.week).toBe(isLast ? 6 : 5);
    });

    it('should return "last" (week 6) when date+7 days crosses month boundary', () => {
      // Last Monday of a 31-day month (e.g. Jan: 1,8,15,22,29); date+7 crosses into next month
      const janEnd = dayjs.utc().year(2024).month(0).endOf('month');
      let lastMondayJan = janEnd;
      while (lastMondayJan.day() !== 1)
        lastMondayJan = lastMondayJan.subtract(1, 'day');
      lastMondayJan = lastMondayJan.hour(10).minute(0).second(0).millisecond(0);
      const options = getMonthlyOptions(lastMondayJan.toDate());
      expect(options.byWeekday).toBe('Monthly on the last Monday');
      expect(options.weekdayValue.week).toBe(6);
      expect(options.weekdayValue.day).toBe(WeekDays.MO);
    });
  });
});
