/**
 * Time utility functions for EventForm component.
 */
import dayjs from 'dayjs';

/**
 * Converts a time string (HH:mm:ss) to a dayjs object.
 * @param time - Time string in HH:mm:ss format
 * @returns A dayjs object with the specified time set on today's date
 * @example
 * timeToDayJs('14:30:00') // Returns dayjs object for 2:30 PM today
 */
export const timeToDayJs = (time: string): dayjs.Dayjs => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return dayjs()
    .hour(hours)
    .minute(minutes)
    .second(seconds || 0);
};
