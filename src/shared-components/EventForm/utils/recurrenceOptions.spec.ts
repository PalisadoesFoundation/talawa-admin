/**
 * Tests for EventForm recurrence options utilities.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildRecurrenceOptions } from './recurrenceOptions';
import { Frequency } from 'utils/recurrenceUtils';

// Mock navigator.language
const mockNavigatorLanguage = vi.spyOn(window.navigator, 'language', 'get');

describe('buildRecurrenceOptions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const mockT = vi.fn((key: string, options?: Record<string, unknown>) => {
    if (options) {
      return `${key}: ${JSON.stringify(options)}`;
    }
    return key;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigatorLanguage.mockReturnValue('en-US');
  });

  it('should return 7 options', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    expect(options).toHaveLength(7);
  });

  it('should have "doesNotRepeat" as first option with null value', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    expect(options[0].label).toBe('doesNotRepeat');
    expect(options[0].value).toBeNull();
  });

  it('should have "daily" option with DAILY frequency', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    expect(options[1].label).toBe('daily');
    expect(options[1].value).not.toBeNull();
    if (options[1].value && options[1].value !== 'custom') {
      expect(options[1].value.frequency).toBe(Frequency.DAILY);
    }
  });

  it('should have "custom" as last option with "custom" value', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    expect(options[6].label).toBe('custom');
    expect(options[6].value).toBe('custom');
  });

  it('should call translation function for each label', () => {
    const startDate = new Date('2024-03-15');
    buildRecurrenceOptions(startDate, mockT);
    expect(mockT).toHaveBeenCalledWith('doesNotRepeat');
    expect(mockT).toHaveBeenCalledWith('daily');
    expect(mockT).toHaveBeenCalledWith('custom');
  });

  it('should handle invalid date gracefully', () => {
    const invalidDate = new Date('invalid');
    const options = buildRecurrenceOptions(invalidDate, mockT);
    expect(options).toHaveLength(7);
    // Should use current date as fallback
    expect(options[0].value).toBeNull();
  });

  it('should include weekday option for recurring events', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    // everyWeekday is the 6th option (index 5)
    expect(options[5].label).toBe('everyWeekday');
    if (options[5].value && options[5].value !== 'custom') {
      expect(options[5].value.byDay).toEqual(['MO', 'TU', 'WE', 'TH', 'FR']);
    }
  });

  it('should include yearly option with correct month and day', () => {
    const startDate = new Date('2024-03-15');
    const options = buildRecurrenceOptions(startDate, mockT);
    // annuallyOn is the 5th option (index 4)
    if (options[4].value && options[4].value !== 'custom') {
      expect(options[4].value.frequency).toBe(Frequency.YEARLY);
      expect(options[4].value.byMonth).toEqual([3]); // March is month 3
      expect(options[4].value.byMonthDay).toEqual([15]);
    }
  });
});
