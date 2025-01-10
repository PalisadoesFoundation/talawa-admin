import { formatDate } from './dateFormatter';

describe('formatDate', () => {
  test('formats date with st suffix', () => {
    expect(formatDate('2023-01-01')).toBe('1st Jan 2023');
    expect(formatDate('2023-05-21')).toBe('21st May 2023');
    expect(formatDate('2023-10-31')).toBe('31st Oct 2023');
  });

  test('formats date with nd suffix', () => {
    expect(formatDate('2023-06-02')).toBe('2nd Jun 2023');
    expect(formatDate('2023-09-22')).toBe('22nd Sep 2023');
  });

  test('formats date with rd suffix', () => {
    expect(formatDate('2023-07-03')).toBe('3rd Jul 2023');
    expect(formatDate('2023-08-23')).toBe('23rd Aug 2023');
  });

  test('formats date with th suffix', () => {
    expect(formatDate('2023-02-04')).toBe('4th Feb 2023');
    expect(formatDate('2023-03-11')).toBe('11th Mar 2023');
    expect(formatDate('2023-04-12')).toBe('12th Apr 2023');
    expect(formatDate('2023-05-13')).toBe('13th May 2023');
    expect(formatDate('2023-06-24')).toBe('24th Jun 2023');
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
