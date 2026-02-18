import { describe, test, expect, vi, afterEach } from 'vitest';
import { formatDate } from './dateFormatter';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

describe('formatDate', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('formats date with st suffix', () => {
    const date1 = dayjs.utc().year(2025).month(0).date(1); // January always has 31 days
    const date2 = dayjs.utc().year(2025).month(0).date(21); // Jan 21, 2025
    const date3 = dayjs.utc().year(2025).month(0).date(31); // Jan 31, 2025
    expect(formatDate(date1.format('YYYY-MM-DD'))).toBe(
      `1st ${date1.format('MMM YYYY')}`,
    );
    expect(formatDate(date2.format('YYYY-MM-DD'))).toBe(
      `21st ${date2.format('MMM YYYY')}`,
    );
    expect(formatDate(date3.format('YYYY-MM-DD'))).toBe(
      `31st ${date3.format('MMM YYYY')}`,
    );
  });

  test('formats date with nd suffix', () => {
    const date1 = dayjs.utc().year(2025).month(0).date(2); // Jan 2, 2025
    const date2 = dayjs.utc().year(2025).month(0).date(22); // Jan 22, 2025
    expect(formatDate(date1.format('YYYY-MM-DD'))).toBe(
      `2nd ${date1.format('MMM YYYY')}`,
    );
    expect(formatDate(date2.format('YYYY-MM-DD'))).toBe(
      `22nd ${date2.format('MMM YYYY')}`,
    );
  });

  test('formats date with rd suffix', () => {
    const date1 = dayjs.utc().year(2025).month(0).date(3); // Jan 3, 2025
    const date2 = dayjs.utc().year(2025).month(0).date(23); // Jan 23, 2025
    expect(formatDate(date1.format('YYYY-MM-DD'))).toBe(
      `3rd ${date1.format('MMM YYYY')}`,
    );
    expect(formatDate(date2.format('YYYY-MM-DD'))).toBe(
      `23rd ${date2.format('MMM YYYY')}`,
    );
  });

  test('formats date with th suffix', () => {
    const dates = [
      dayjs.utc().year(2025).month(0).date(4),
      dayjs.utc().year(2025).month(0).date(11),
      dayjs.utc().year(2025).month(0).date(12),
      dayjs.utc().year(2025).month(0).date(13),
      dayjs.utc().year(2025).month(0).date(24),
    ];

    expect(formatDate(dates[0].format('YYYY-MM-DD'))).toBe(
      `4th ${dates[0].format('MMM YYYY')}`,
    );
    expect(formatDate(dates[1].format('YYYY-MM-DD'))).toBe(
      `11th ${dates[1].format('MMM YYYY')}`,
    );
    expect(formatDate(dates[2].format('YYYY-MM-DD'))).toBe(
      `12th ${dates[2].format('MMM YYYY')}`,
    );
    expect(formatDate(dates[3].format('YYYY-MM-DD'))).toBe(
      `13th ${dates[3].format('MMM YYYY')}`,
    );
    expect(formatDate(dates[4].format('YYYY-MM-DD'))).toBe(
      `24th ${dates[4].format('MMM YYYY')}`,
    );
  });

  test('throws error for empty date string', () => {
    expect(() => formatDate('')).toThrow('Date string is required');
  });

  test('throws error for invalid date string', () => {
    expect(() => formatDate('invalid-date')).toThrow(
      'Invalid date string provided',
    );
  });
});
