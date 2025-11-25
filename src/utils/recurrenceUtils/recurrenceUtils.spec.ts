import {
  validateRecurrenceInput,
  getRecurrenceRuleText,
  getOrdinalSuffix,
  createDefaultRecurrenceRule,
  getEndTypeFromRecurrence,
  areRecurrenceRulesEqual,
  formatRecurrenceForApi,
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
});
