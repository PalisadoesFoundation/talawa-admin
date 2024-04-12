import dayjs from 'dayjs';
import { convertDateLocalToUTC } from './convertDateLocalToUTC';

describe('convertLocalToUTC', () => {
  test('should convert local date to UTC date', () => {
    const localDate = new Date('2024-04-09T12:00:00');

    const utcDate = convertDateLocalToUTC(localDate);

    const expectedUTCDate = new Date('2024-04-09T12:00:00').getTime();

    expect(dayjs(utcDate).format('YYYY-MM-DD')).toEqual(
      dayjs(expectedUTCDate).format('YYYY-MM-DD'),
    );
  });
});
