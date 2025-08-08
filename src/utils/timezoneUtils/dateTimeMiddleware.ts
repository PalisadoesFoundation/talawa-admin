import { ApolloLink } from '@apollo/client/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { dateTimeFields } from './dateTimeConfig';

// Extend dayjs with the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const combineDateTime = (date: string, time: string): string => {
  return `${date}T${time}`;
};

const splitDateTime = (dateTimeStr: string): { date: string; time: string } => {
  const dateTime = dayjs.utc(dateTimeStr);
  if (!dateTime.isValid()) {
    const [date, time] = dateTimeStr.split('T');
    return {
      date: date,
      time: time,
    };
  }
  return {
    date: dateTime.format('YYYY-MM-DD'),
    time: dateTime.format('HH:mm:ss.SSS[Z]'),
  };
};

const convertUTCToLocal = (dateStr: string): string => {
  if (!dayjs(dateStr).isValid()) {
    return dateStr;
  }
  return dayjs.utc(dateStr).local().format('YYYY-MM-DDTHH:mm:ss.SSS');
};

const convertLocalToUTC = (dateStr: string): string => {
  if (!dayjs(dateStr).isValid()) {
    return dateStr; // Leave the invalid value unchanged
  }
  return dayjs(dateStr).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
};

const traverseAndConvertDates = (
  obj: Record<string, unknown>,
  convertFn: (dateStr: string) => string,
  splitFn: (dateTimeStr: string) => { date: string; time: string },
): void => {
  if (typeof obj !== 'object' || obj === null) return;

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    // Handle paired date and time fields
    dateTimeFields.pairedFields.forEach(({ dateField, timeField }) => {
      if (key === dateField && obj[timeField]) {
        const combinedDateTime = combineDateTime(
          obj[dateField] as string,
          obj[timeField] as string,
        );
        const convertedDateTime = convertFn(combinedDateTime);
        const { date, time } = splitFn(convertedDateTime);
        obj[dateField] = date; // Restore the original date field
        obj[timeField] = time; // Restore the original time field
      }
    });

    // Convert simple date/time fields
    if (dateTimeFields.directFields.includes(key)) {
      obj[key] = convertFn(value as string);
    }

    if (typeof value === 'object' && value !== null) {
      traverseAndConvertDates(
        value as Record<string, unknown>,
        convertFn,
        splitFn,
      ); // Recursive call for nested objects/arrays
    }
  });
};

// Request middleware to convert local time to UTC time
export const requestMiddleware = new ApolloLink((operation, forward) => {
  traverseAndConvertDates(
    operation.variables,
    convertLocalToUTC,
    splitDateTime,
  );
  return forward(operation);
});

// Response middleware to convert UTC time to local time
export const responseMiddleware = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    if (response.data) {
      traverseAndConvertDates(
        response.data as Record<string, unknown>,
        convertUTCToLocal,
        splitDateTime,
      );
    }
    return response;
  });
});
