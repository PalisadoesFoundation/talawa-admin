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

// Helper functions to find specific dates dynamically
// Get the nth occurrence of a specific day of week in a given month
const getNthDayOfWeekInMonth = (
  yearMonth: dayjs.Dayjs,
  dayOfWeek: number,
  nthOccurrence: number,
): dayjs.Dayjs => {
  let count = 0;
  for (let day = 1; day <= yearMonth.daysInMonth(); day++) {
    const date = yearMonth.date(day);
    if (date.day() === dayOfWeek) {
      count++;
      if (count === nthOccurrence) {
        return date.hour(10);
      }
    }
  }
  // Fallback - return last occurrence if nth doesn't exist
  return yearMonth.date(1).hour(10);
};

// Find a leap year Feb 29 (current or next)
const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const findLeapYearFeb29 = (): dayjs.Dayjs => {
  let year = dayjs().year();
  // Check if current year is leap year and we haven't passed Feb
  if (dayjs().month() < 2 && isLeapYear(year)) {
    return dayjs(`${year}-02-29T10:00:00.000Z`);
  }

  if (dayjs().month() >= 2) {
    year++;
  }
  while (!isLeapYear(year)) {
    year++;
  }
  return dayjs(`${year}-02-29T10:00:00.000Z`);
};

// Get a future month for testing
const getFutureMonth = (monthsAhead = 2): dayjs.Dayjs => {
  return dayjs().add(monthsAhead, 'month').startOf('month');
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

  // Use a dynamic date for general tests
  const startDate = dayjs()
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
      const pastEndDate = dayjs(startDate).subtract(1, 'day').toDate();
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
      const futureEndDate = dayjs()
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
      // Dynamically compute expected day from startDate
      const expectedDay = dayjs(startDate).date();
      expect(text).toBe(`Monthly on Day ${expectedDay}, never ends`);
    });

    it('should generate correct text for yearly recurrence without specified month or day', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      // Dynamically compute expected month and day from startDate
      const expectedMonth = dayjs(startDate).format('MMMM');
      const expectedDay = dayjs(startDate).date();
      const expectedSuffix = getOrdinalSuffix(expectedDay);
      expect(text).toBe(
        `Annually in ${expectedMonth} on the ${expectedDay}${expectedSuffix}, never ends`,
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
      const expectedDay = dayIndexToWeekDay[dayjs(startDate).day()];
      expect(rule).toEqual({
        frequency: Frequency.WEEKLY,
        interval: 1,
        never: true,
        byDay: [expectedDay],
      });
    });

    it('should create a default monthly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.MONTHLY);
      // Dynamically compute expected day from startDate
      const expectedDay = dayjs(startDate).date();
      expect(rule).toEqual({
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
        byMonthDay: [expectedDay],
      });
    });

    it('should create a default yearly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.YEARLY);
      // Dynamically compute expected month and day from startDate
      const expectedMonth = dayjs(startDate).month() + 1;
      const expectedDay = dayjs(startDate).date();
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
      const futureEndDate = dayjs()
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
    // Use dynamic dates based on a future month
    const testMonth = getFutureMonth(2);

    it('should return correct week for day 5 of the month (week 1)', () => {
      const date = testMonth.date(5).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(1);
    });
    it('should return correct week for day 8 of the month (week 2)', () => {
      const date = testMonth.date(8).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(2);
    });
    it('should return correct week for day 15 of the month (week 3)', () => {
      const date = testMonth.date(15).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(3);
    });
    it('should return correct week for day 22 of the month (week 4)', () => {
      const date = testMonth.date(22).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(4);
    });
    it('should return correct week for day 29 of the month (week 5)', () => {
      const date = testMonth.date(29).hour(10).toDate();
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle dates at the end of the month correctly', () => {
      // Last day can be 28, 29, 30, or 31, corresponding to week 4 or 5
      const lastDay = testMonth.endOf('month').hour(10).toDate();
      const dayOfMonth = testMonth.daysInMonth();
      const expectedWeek = Math.ceil(dayOfMonth / 7);
      expect(getWeekOfMonth(lastDay)).toBe(expectedWeek);
    });

    it('should handle February correctly', () => {
      // Find a future February and test day 28 (week 4)
      let year = dayjs().year();
      if (dayjs().month() >= 2) year++;
      const febDate = dayjs(`${year}-02-28T10:00:00.000Z`).toDate();
      expect(getWeekOfMonth(febDate)).toBe(4);
    });

    it('should handle February correctly in leap year (29 days - week 5)', () => {
      // Use the helper to find Feb 29
      const feb29 = findLeapYearFeb29().toDate();
      expect(getWeekOfMonth(feb29)).toBe(5);
    });

    it('should handle months starting on different days of the week', () => {
      // First day of any month should always be week 1, regardless of day of week
      const month1 = getFutureMonth(1).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month1)).toBe(1);

      const month2 = getFutureMonth(2).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month2)).toBe(1);

      const month3 = getFutureMonth(3).date(1).hour(10).toDate();
      expect(getWeekOfMonth(month3)).toBe(1);
    });

    it('should handle different years correctly', () => {
      // Day 15 of any month should be in week 3
      const thisYear = dayjs().add(1, 'month').date(15).hour(10).toDate();
      const nextYear = dayjs()
        .add(1, 'year')
        .add(1, 'month')
        .date(15)
        .hour(10)
        .toDate();
      const yearAfter = dayjs()
        .add(2, 'year')
        .add(1, 'month')
        .date(15)
        .hour(10)
        .toDate();

      [thisYear, nextYear, yearAfter].forEach((date) => {
        expect(getWeekOfMonth(date)).toBe(3);
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
    // Use dynamic dates based on future months
    const testMonth = getFutureMonth(2);

    it('should return correct options for a date in the middle of the month', () => {
      // Find the 3rd Monday of the test month
      const thirdMonday = getNthDayOfWeekInMonth(testMonth, 1, 3); // 1 = Monday
      const options = getMonthlyOptions(thirdMonday.toDate());
      const dayOfMonth = thirdMonday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      const expectedWeek = Math.ceil(
        (dayOfMonth + thirdMonday.startOf('month').day()) / 7,
      );
      expect(options.byWeekday).toBe(
        `Monthly on the ${getOrdinalString(expectedWeek)} Monday`,
      );
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({
        week: expectedWeek,
        day: WeekDays.MO,
      });
    });

    it('should return correct options for the first day of the month', () => {
      // First day of month - find what day of week it is
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
      // Day 29 is always in week 5
      const day29 = testMonth.date(29).hour(10);
      const dayOfWeek = day29.day();
      const dayName = getDayNameFromIndex(dayOfWeek);
      const options = getMonthlyOptions(day29.toDate());

      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe(`Monthly on the fifth ${dayName}`);
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({
        week: 5,
        day: dayIndexToWeekDay[dayOfWeek],
      });
    });

    it('should return correct options for a date in the first week', () => {
      // Find the 1st Friday of the test month
      const firstFriday = getNthDayOfWeekInMonth(testMonth, 5, 1); // 5 = Friday
      const options = getMonthlyOptions(firstFriday.toDate());
      const dayOfMonth = firstFriday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the first Friday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 1, day: WeekDays.FR });
    });

    it('should return correct options for a date in the second week', () => {
      // Find the 2nd Wednesday of the test month
      const secondWednesday = getNthDayOfWeekInMonth(testMonth, 3, 2); // 3 = Wednesday
      const options = getMonthlyOptions(secondWednesday.toDate());
      const dayOfMonth = secondWednesday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the second Wednesday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 2, day: WeekDays.WE });
    });

    it('should return correct options for a date in the fourth week', () => {
      // Find the 4th Thursday of the test month
      const fourthThursday = getNthDayOfWeekInMonth(testMonth, 4, 4); // 4 = Thursday
      const options = getMonthlyOptions(fourthThursday.toDate());
      const dayOfMonth = fourthThursday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the fourth Thursday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.TH });
    });

    it('should return correct options for a Sunday', () => {
      // Find the 4th Sunday of the test month
      const fourthSunday = getNthDayOfWeekInMonth(testMonth, 0, 4); // 0 = Sunday
      const options = getMonthlyOptions(fourthSunday.toDate());
      const dayOfMonth = fourthSunday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      const expectedWeek = Math.ceil(
        (dayOfMonth + fourthSunday.startOf('month').day()) / 7,
      );
      expect(options.byWeekday).toBe(
        `Monthly on the ${getOrdinalString(expectedWeek)} Sunday`,
      );
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({
        week: expectedWeek,
        day: WeekDays.SU,
      });
    });

    it('should return correct options for a Saturday', () => {
      // Find the 4th Saturday of the test month
      const fourthSaturday = getNthDayOfWeekInMonth(testMonth, 6, 4); // 6 = Saturday
      const options = getMonthlyOptions(fourthSaturday.toDate());
      const dayOfMonth = fourthSaturday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the fourth Saturday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.SA });
    });

    it('should handle February correctly', () => {
      // Find a future February
      let year = dayjs().year();
      if (dayjs().month() >= 2) year++;
      const febMonth = dayjs(`${year}-02-01`);
      // Find 3rd Wednesday of Feb
      const thirdWednesday = getNthDayOfWeekInMonth(febMonth, 3, 3);
      const options = getMonthlyOptions(thirdWednesday.toDate());
      const dayOfMonth = thirdWednesday.date();

      expect(options.byDate).toBe(`Monthly on day ${dayOfMonth}`);
      expect(options.byWeekday).toBe('Monthly on the third Wednesday');
      expect(options.dateValue).toBe(dayOfMonth);
      expect(options.weekdayValue).toEqual({ week: 3, day: WeekDays.WE });
    });

    it('should handle February in leap year correctly (29 days)', () => {
      // Use the helper to find Feb 29
      const feb29 = findLeapYearFeb29();
      const options = getMonthlyOptions(feb29.toDate());
      const dayOfWeek = feb29.day();
      const dayName = getDayNameFromIndex(dayOfWeek);

      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe(`Monthly on the fifth ${dayName}`);
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({
        week: 5,
        day: dayIndexToWeekDay[dayOfWeek],
      });
    });

    it('should handle different months correctly', () => {
      // Day 15 should always have dateValue of 15
      const month1 = getFutureMonth(1).date(15).hour(10).toDate();
      const month2 = getFutureMonth(2).date(15).hour(10).toDate();
      const month3 = getFutureMonth(3).date(15).hour(10).toDate();

      expect(getMonthlyOptions(month1).dateValue).toBe(15);
      expect(getMonthlyOptions(month2).dateValue).toBe(15);
      expect(getMonthlyOptions(month3).dateValue).toBe(15);
    });

    it('should return consistent weekday values for the same day of week', () => {
      // Find 1st, 2nd, and 3rd Monday of test month
      const monday1 = getNthDayOfWeekInMonth(testMonth, 1, 1).toDate();
      const monday2 = getNthDayOfWeekInMonth(testMonth, 1, 2).toDate();
      const monday3 = getNthDayOfWeekInMonth(testMonth, 1, 3).toDate();

      expect(getMonthlyOptions(monday1).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday2).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday3).weekdayValue.day).toBe(WeekDays.MO);

      const getExpectedWeek = (date: Date) => {
        const d = dayjs(date);
        const firstDayOfMonth = d.startOf('month').day();
        return Math.ceil((d.date() + firstDayOfMonth) / 7);
      };

      expect(getMonthlyOptions(monday1).weekdayValue.week).toBe(
        getExpectedWeek(monday1),
      );
      expect(getMonthlyOptions(monday2).weekdayValue.week).toBe(
        getExpectedWeek(monday2),
      );
      expect(getMonthlyOptions(monday3).weekdayValue.week).toBe(
        getExpectedWeek(monday3),
      );
    });

    it('should handle edge case: date that falls in the fifth week', () => {
      // Find 5th Monday of a month (if it exists) or use day 29
      const fifthMonday = getNthDayOfWeekInMonth(testMonth, 1, 5);
      // If there's no 5th Monday, use day 29
      const testDate =
        fifthMonday.date() > 7 ? fifthMonday : testMonth.date(29).hour(10);
      const options = getMonthlyOptions(testDate.toDate());

      expect(options.dateValue).toBe(testDate.date());
      expect(options.weekdayValue.week).toBe(5);
    });
  });
});
