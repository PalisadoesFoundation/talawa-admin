/**
 * Tests for EventForm time utilities.
 */
import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { timeToDayJs } from './timeUtils';

describe('timeToDayJs', () => {
  it('should convert time string to dayjs object with correct hours', () => {
    const result = timeToDayJs('14:30:00');
    expect(result.hour()).toBe(14);
  });

  it('should convert time string to dayjs object with correct minutes', () => {
    const result = timeToDayJs('14:30:00');
    expect(result.minute()).toBe(30);
  });

  it('should convert time string to dayjs object with correct seconds', () => {
    const result = timeToDayJs('14:30:45');
    expect(result.second()).toBe(45);
  });

  it('should default seconds to 0 when not provided', () => {
    const result = timeToDayJs('09:15');
    expect(result.second()).toBe(0);
  });

  it('should handle midnight correctly', () => {
    const result = timeToDayJs('00:00:00');
    expect(result.hour()).toBe(0);
    expect(result.minute()).toBe(0);
    expect(result.second()).toBe(0);
  });

  it('should handle end of day correctly', () => {
    const result = timeToDayJs('23:59:59');
    expect(result.hour()).toBe(23);
    expect(result.minute()).toBe(59);
    expect(result.second()).toBe(59);
  });

  it('should return a dayjs object', () => {
    const result = timeToDayJs('10:00:00');
    expect(dayjs.isDayjs(result)).toBe(true);
  });
});
