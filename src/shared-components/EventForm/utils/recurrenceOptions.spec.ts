/**
 * Tests for EventForm recurrence options utilities.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import dayjs from 'dayjs';
import { buildRecurrenceOptions } from './recurrenceOptions';
import { Frequency } from 'utils/recurrenceUtils';

// Mock navigator.language
const mockNavigatorLanguage = vi.spyOn(window.navigator, 'language', 'get');

// Use dynamic dates to avoid hardcoded date strings
const futureDate = dayjs().add(30, 'days').toDate();
const futureDateMonth = dayjs().add(30, 'days').month() + 1; // 1-indexed
const futureDateDay = dayjs().add(30, 'days').date();

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
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options).toHaveLength(7);
  });

  it('should have "doesNotRepeat" as first option with null value', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options[0].label).toBe('doesNotRepeat');
    expect(options[0].value).toBeNull();
  });

  it('should have "daily" option with DAILY frequency', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options[1].label).toBe('daily');
    expect(options[1].value).not.toBeNull();
    if (options[1].value && options[1].value !== 'custom') {
      expect(options[1].value.frequency).toBe(Frequency.DAILY);
    }
  });

  it('should have "weeklyOn" option with WEEKLY frequency', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options[2].label).toContain('weeklyOn');
    if (options[2].value && options[2].value !== 'custom') {
      expect(options[2].value.frequency).toBe(Frequency.WEEKLY);
    }
  });

  it('should have "monthlyOnDay" option with MONTHLY frequency', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options[3].label).toContain('monthlyOnDay');
    if (options[3].value && options[3].value !== 'custom') {
      expect(options[3].value.frequency).toBe(Frequency.MONTHLY);
    }
  });

  it('should have "custom" as last option with "custom" value', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    expect(options[6].label).toBe('custom');
    expect(options[6].value).toBe('custom');
  });

  it('should call translation function for each label', () => {
    buildRecurrenceOptions(futureDate, mockT);
    expect(mockT).toHaveBeenCalledWith('doesNotRepeat');
    expect(mockT).toHaveBeenCalledWith('daily');
    expect(mockT).toHaveBeenCalledWith('custom');
    expect(mockT).toHaveBeenCalledWith('everyWeekday');
    // Verify calls with options parameters
    expect(mockT).toHaveBeenCalledWith(
      'weeklyOn',
      expect.objectContaining({ day: expect.any(String) }),
    );
    expect(mockT).toHaveBeenCalledWith(
      'monthlyOnDay',
      expect.objectContaining({ day: futureDateDay }),
    );
    expect(mockT).toHaveBeenCalledWith(
      'annuallyOn',
      expect.objectContaining({
        month: expect.any(String),
        day: futureDateDay,
      }),
    );
  });

  it('should handle invalid date gracefully', () => {
    const invalidDate = new Date('invalid');
    const options = buildRecurrenceOptions(invalidDate, mockT);
    expect(options).toHaveLength(7);
    // Should use current date as fallback
    expect(options[0].value).toBeNull();
  });

  it('should include weekday option for recurring events', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    // everyWeekday is the 6th option (index 5)
    expect(options[5].label).toBe('everyWeekday');
    if (options[5].value && options[5].value !== 'custom') {
      expect(options[5].value.byDay).toEqual(['MO', 'TU', 'WE', 'TH', 'FR']);
    }
  });

  it('should include yearly option with correct month and day', () => {
    const options = buildRecurrenceOptions(futureDate, mockT);
    // annuallyOn is the 5th option (index 4)
    if (options[4].value && options[4].value !== 'custom') {
      expect(options[4].value.frequency).toBe(Frequency.YEARLY);
      expect(options[4].value.byMonth).toEqual([futureDateMonth]);
      expect(options[4].value.byMonthDay).toEqual([futureDateDay]);
    }
  });
});
