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

describe('Recurrence Utility Functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const startDate = new Date('2024-07-21T10:00:00.000Z');

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
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate: new Date('2024-07-20T10:00:00.000Z'),
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
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.MONTHLY,
        interval: 1,
        byMonthDay: [15],
        endDate: new Date('2025-07-21T10:00:00.000Z'),
      };
      const text = getRecurrenceRuleText(
        rule,
        startDate,
        new Date('2025-07-21T10:00:00.000Z'),
      );
      expect(text).toBe('Monthly on the 15th, until July 21, 2025');
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
      expect(text).toBe('Monthly on Day 21, never ends');
    });

    it('should generate correct text for yearly recurrence without specified month or day', () => {
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
      };
      const text = getRecurrenceRuleText(rule, startDate);
      expect(text).toBe('Annually in July on the 21st, never ends');
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
      expect(rule).toEqual({
        frequency: Frequency.WEEKLY,
        interval: 1,
        never: true,
        byDay: [WeekDays.SU],
      });
    });

    it('should create a default monthly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.MONTHLY);
      expect(rule).toEqual({
        frequency: Frequency.MONTHLY,
        interval: 1,
        never: true,
        byMonthDay: [21],
      });
    });

    it('should create a default yearly rule', () => {
      const rule = createDefaultRecurrenceRule(startDate, Frequency.YEARLY);
      expect(rule).toEqual({
        frequency: Frequency.YEARLY,
        interval: 1,
        never: true,
        byMonth: [7],
        byMonthDay: [21],
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
      const rule: InterfaceRecurrenceRule = {
        frequency: Frequency.DAILY,
        interval: 1,
        endDate: new Date('2025-01-01T12:00:00.000Z'),
      };
      const formattedRule = formatRecurrenceForApi(rule);
      expect(formattedRule.endDate).toBe('2025-01-01T12:00:00.000Z');
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
    it('should return 1 for the first day of the month', () => {
      const date = new Date('2024-01-01T10:00:00.000Z');
      expect(getWeekOfMonth(date)).toBe(1);
    });

    it('should return 1 for dates in the first week', () => {
      const date = new Date('2024-01-05T10:00:00.000Z'); // Friday, Jan 5
      expect(getWeekOfMonth(date)).toBe(1);
    });

    it('should return 2 for dates in the second week', () => {
      const date = new Date('2024-01-08T10:00:00.000Z'); // Monday, Jan 8
      expect(getWeekOfMonth(date)).toBe(2);
    });

    it('should return 3 for dates in the third week', () => {
      const date = new Date('2024-01-15T10:00:00.000Z'); // Monday, Jan 15
      expect(getWeekOfMonth(date)).toBe(3);
    });

    it('should return 4 for dates in the fourth week', () => {
      const date = new Date('2024-01-22T10:00:00.000Z'); // Monday, Jan 22
      expect(getWeekOfMonth(date)).toBe(4);
    });

    it('should return 5 for dates in the fifth week', () => {
      const date = new Date('2024-01-29T10:00:00.000Z'); // Monday, Jan 29
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle dates at the end of the month correctly', () => {
      const date = new Date('2024-01-31T10:00:00.000Z'); // Wednesday, Jan 31
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle February correctly (28 days)', () => {
      const date = new Date('2024-02-28T10:00:00.000Z'); // Wednesday, Feb 28
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle February correctly in leap year (29 days)', () => {
      const date = new Date('2024-02-29T10:00:00.000Z'); // Thursday, Feb 29 (leap year)
      expect(getWeekOfMonth(date)).toBe(5);
    });

    it('should handle months starting on different days of the week', () => {
      // January 2024 starts on Monday
      const janDate = new Date('2024-01-01T10:00:00.000Z');
      expect(getWeekOfMonth(janDate)).toBe(1);

      // February 2024 starts on Thursday
      const febDate = new Date('2024-02-01T10:00:00.000Z');
      expect(getWeekOfMonth(febDate)).toBe(1);

      // March 2024 starts on Friday
      const marDate = new Date('2024-03-01T10:00:00.000Z');
      expect(getWeekOfMonth(marDate)).toBe(1);
    });

    it('should handle different years correctly', () => {
      const date2023 = new Date('2023-07-21T10:00:00.000Z');
      const date2024 = new Date('2024-07-21T10:00:00.000Z');
      const date2025 = new Date('2025-07-21T10:00:00.000Z');

      expect(getWeekOfMonth(date2023)).toBe(4);
      expect(getWeekOfMonth(date2024)).toBe(4);
      expect(getWeekOfMonth(date2025)).toBe(4);
    });

    it('should handle edge case: date in the middle of the month', () => {
      const date = new Date('2024-07-15T10:00:00.000Z'); // Monday, July 15
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

    it('should handle out of range indices gracefully', () => {
      // The function uses Days array which has 7 elements (0-6)
      // Testing with index 7 should still work if Days array is accessed with modulo or bounds
      // But based on the implementation, it directly accesses Days[dayIndex], so it might return undefined
      // Let's test the actual behavior
      expect(() => getDayName(7)).not.toThrow();
      expect(() => getDayName(-1)).not.toThrow();
    });
  });

  describe('getMonthlyOptions', () => {
    it('should return correct options for a date in the middle of the month', () => {
      const startDate = new Date('2024-07-15T10:00:00.000Z'); // Monday, July 15
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 15');
      expect(options.byWeekday).toBe('Monthly on the third Monday');
      expect(options.dateValue).toBe(15);
      expect(options.weekdayValue).toEqual({ week: 3, day: WeekDays.MO });
    });

    it('should return correct options for the first day of the month', () => {
      const startDate = new Date('2024-01-01T10:00:00.000Z'); // Monday, Jan 1
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 1');
      expect(options.byWeekday).toBe('Monthly on the first Monday');
      expect(options.dateValue).toBe(1);
      expect(options.weekdayValue).toEqual({ week: 1, day: WeekDays.MO });
    });

    it('should return correct options for the last day of the month', () => {
      const startDate = new Date('2024-01-31T10:00:00.000Z'); // Wednesday, Jan 31
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 31');
      expect(options.byWeekday).toBe('Monthly on the fifth Wednesday');
      expect(options.dateValue).toBe(31);
      expect(options.weekdayValue).toEqual({ week: 5, day: WeekDays.WE });
    });

    it('should return correct options for a date in the first week', () => {
      const startDate = new Date('2024-07-05T10:00:00.000Z'); // Friday, July 5
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 5');
      expect(options.byWeekday).toBe('Monthly on the first Friday');
      expect(options.dateValue).toBe(5);
      expect(options.weekdayValue).toEqual({ week: 1, day: WeekDays.FR });
    });

    it('should return correct options for a date in the second week', () => {
      const startDate = new Date('2024-07-10T10:00:00.000Z'); // Wednesday, July 10
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 10');
      expect(options.byWeekday).toBe('Monthly on the second Wednesday');
      expect(options.dateValue).toBe(10);
      expect(options.weekdayValue).toEqual({ week: 2, day: WeekDays.WE });
    });

    it('should return correct options for a date in the fourth week', () => {
      const startDate = new Date('2024-07-25T10:00:00.000Z'); // Thursday, July 25
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 25');
      expect(options.byWeekday).toBe('Monthly on the fourth Thursday');
      expect(options.dateValue).toBe(25);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.TH });
    });

    it('should return correct options for a Sunday', () => {
      const startDate = new Date('2024-07-21T10:00:00.000Z'); // Sunday, July 21
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 21');
      expect(options.byWeekday).toBe('Monthly on the fourth Sunday');
      expect(options.dateValue).toBe(21);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.SU });
    });

    it('should return correct options for a Saturday', () => {
      const startDate = new Date('2024-07-27T10:00:00.000Z'); // Saturday, July 27
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 27');
      expect(options.byWeekday).toBe('Monthly on the fourth Saturday');
      expect(options.dateValue).toBe(27);
      expect(options.weekdayValue).toEqual({ week: 4, day: WeekDays.SA });
    });

    it('should handle February correctly (28 days)', () => {
      const startDate = new Date('2024-02-14T10:00:00.000Z'); // Wednesday, Feb 14
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 14');
      expect(options.byWeekday).toBe('Monthly on the third Wednesday');
      expect(options.dateValue).toBe(14);
      expect(options.weekdayValue).toEqual({ week: 3, day: WeekDays.WE });
    });

    it('should handle February in leap year correctly (29 days)', () => {
      const startDate = new Date('2024-02-29T10:00:00.000Z'); // Thursday, Feb 29 (leap year)
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe('Monthly on the fifth Thursday');
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({ week: 5, day: WeekDays.TH });
    });

    it('should handle different months correctly', () => {
      const janDate = new Date('2024-01-15T10:00:00.000Z');
      const febDate = new Date('2024-02-15T10:00:00.000Z');
      const marDate = new Date('2024-03-15T10:00:00.000Z');

      expect(getMonthlyOptions(janDate).dateValue).toBe(15);
      expect(getMonthlyOptions(febDate).dateValue).toBe(15);
      expect(getMonthlyOptions(marDate).dateValue).toBe(15);
    });

    it('should return consistent weekday values for the same day of week', () => {
      const monday1 = new Date('2024-07-01T10:00:00.000Z'); // First Monday
      const monday2 = new Date('2024-07-08T10:00:00.000Z'); // Second Monday
      const monday3 = new Date('2024-07-15T10:00:00.000Z'); // Third Monday

      expect(getMonthlyOptions(monday1).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday2).weekdayValue.day).toBe(WeekDays.MO);
      expect(getMonthlyOptions(monday3).weekdayValue.day).toBe(WeekDays.MO);

      expect(getMonthlyOptions(monday1).weekdayValue.week).toBe(1);
      expect(getMonthlyOptions(monday2).weekdayValue.week).toBe(2);
      expect(getMonthlyOptions(monday3).weekdayValue.week).toBe(3);
    });

    it('should handle edge case: date that falls in the fifth week', () => {
      const startDate = new Date('2024-01-29T10:00:00.000Z'); // Monday, Jan 29
      const options = getMonthlyOptions(startDate);

      expect(options.byDate).toBe('Monthly on day 29');
      expect(options.byWeekday).toBe('Monthly on the fifth Monday');
      expect(options.dateValue).toBe(29);
      expect(options.weekdayValue).toEqual({ week: 5, day: WeekDays.MO });
    });
  });
});
