/*
   Recurrence utility functions
*/

import dayjs from 'dayjs';
import {
  Days,
  dayNames,
  mondayToFriday,
  monthNames,
  weekDayOccurences,
} from './recurrenceConstants';
import { Frequency } from './recurrenceTypes';
import type {
  WeekDays,
  InterfaceRecurrenceRuleState,
  InterfaceRecurrenceRule,
} from './recurrenceTypes';

// function that generates the recurrence rule text to display
// e.g. - 'Weekly on Sunday, until Feburary 23, 2029'
export const getRecurrenceRuleText = (
  recurrenceRuleState: InterfaceRecurrenceRuleState,
): string => {
  let recurrenceRuleText = '';
  const {
    recurrenceStartDate,
    recurrenceEndDate,
    frequency,
    weekDays,
    interval,
    count,
    weekDayOccurenceInMonth,
  } = recurrenceRuleState;

  switch (frequency) {
    case Frequency.DAILY:
      if (interval && interval > 1) {
        recurrenceRuleText = `Every ${interval} days`;
      } else {
        recurrenceRuleText = 'Daily';
      }
      break;

    case Frequency.WEEKLY:
      if (isMondayToFriday(weekDays)) {
        if (interval && interval > 1) {
          recurrenceRuleText = `Every ${interval} weeks, `;
        }
        recurrenceRuleText += 'Monday to Friday';
        break;
      }
      if (interval && interval > 1) {
        recurrenceRuleText = `Every ${interval} weeks on `;
      } else {
        recurrenceRuleText = 'Weekly on ';
      }
      recurrenceRuleText += getWeekDaysString(weekDays);
      break;

    case Frequency.MONTHLY:
      if (interval && interval > 1) {
        recurrenceRuleText = `Every ${interval} months on `;
      } else {
        recurrenceRuleText = 'Monthly on ';
      }

      if (weekDayOccurenceInMonth) {
        const getOccurence =
          weekDayOccurenceInMonth !== -1 ? weekDayOccurenceInMonth - 1 : 4;
        recurrenceRuleText += `${weekDayOccurences[getOccurence]} ${dayNames[Days[recurrenceStartDate.getDay()]]}`;
      } else {
        recurrenceRuleText += `Day ${recurrenceStartDate.getDate()}`;
      }
      break;

    case Frequency.YEARLY:
      if (interval && interval > 1) {
        recurrenceRuleText = `Every ${interval} years on `;
      } else {
        recurrenceRuleText = 'Annually on ';
      }
      recurrenceRuleText += `${monthNames[recurrenceStartDate.getMonth()]} ${recurrenceStartDate.getDate()}`;
      break;
  }

  if (recurrenceEndDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recurrenceRuleText += `, until  ${recurrenceEndDate.toLocaleDateString('en-US', options)}`;
  }

  if (count) {
    recurrenceRuleText += `, ${count} ${count > 1 ? 'times' : 'time'}`;
  }

  return recurrenceRuleText;
};

// function that generates a string of selected week days for the recurrence rule text
// e.g. - for an array ['MONDAY', 'TUESDAY', 'FRIDAY'], it would output: 'Monday, Tuesday & Friday'
const getWeekDaysString = (weekDays: WeekDays[]): string => {
  const fullDayNames = weekDays.map((day) => dayNames[day]);

  let weekDaysString = fullDayNames.join(', ');

  const lastCommaIndex = weekDaysString.lastIndexOf(',');
  if (lastCommaIndex !== -1) {
    weekDaysString =
      weekDaysString.substring(0, lastCommaIndex) +
      ' &' +
      weekDaysString.substring(lastCommaIndex + 1);
  }

  return weekDaysString;
};

// function that checks if the array contains all days from Monday to Friday
const isMondayToFriday = (weekDays: WeekDays[]): boolean => {
  return mondayToFriday.every((day) => weekDays.includes(day));
};

// function that returns the occurence of the weekday in a month,
// i.e. First Monday, Second Monday, Last Monday, etc.
export const getWeekDayOccurenceInMonth = (date: Date): number => {
  const dayOfMonth = date.getDate();

  // Calculate the current occurrence
  const occurrence = Math.ceil(dayOfMonth / 7);

  return occurrence;
};

// function that checks whether it's the last occurence of the weekday in that month
export const isLastOccurenceOfWeekDay = (date: Date): boolean => {
  const currentDay = date.getDay();

  const lastOccurenceInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0,
  );

  // set the lastOccurenceInMonth to that day's last occurence
  while (lastOccurenceInMonth.getDay() !== currentDay) {
    lastOccurenceInMonth.setDate(lastOccurenceInMonth.getDate() - 1);
  }

  return date.getDate() === lastOccurenceInMonth.getDate();
};

// function that evaluates whether the startDate or endDate of a recurring event instance have changed
export const haveInstanceDatesChanged = (
  instanceOriginalStartDate: string,
  instanceOriginalEndDate: string,
  instanceNewStartDate: string,
  instanceNewEndDate: string,
): boolean => {
  return (
    instanceOriginalStartDate !== instanceNewStartDate ||
    instanceOriginalEndDate !== instanceNewEndDate
  );
};

// function that checks whether the recurrence rule has changed
export const hasRecurrenceRuleChanged = (
  originalRecurrencerule: InterfaceRecurrenceRule | null,
  recurrenceRuleState: InterfaceRecurrenceRuleState,
): boolean => {
  if (!originalRecurrencerule) {
    return false;
  }

  const newRecurrenceRule = getRecurrenceRule(recurrenceRuleState);

  const recurrenceProperties = Object.keys(
    newRecurrenceRule,
  ) as (keyof InterfaceRecurrenceRule)[];

  for (const recurrenceProperty of recurrenceProperties) {
    if (recurrenceProperty === 'weekDays') {
      if (
        weekDaysHaveChanged(
          originalRecurrencerule.weekDays,
          newRecurrenceRule.weekDays,
        )
      ) {
        return true;
      }
    } else if (
      originalRecurrencerule[recurrenceProperty] !==
      newRecurrenceRule[recurrenceProperty]
    ) {
      return true;
    }
  }

  return false;
};

// function that returns the recurrence rule object based on the current recurrence rule state
const getRecurrenceRule = (
  recurrenceRuleState: InterfaceRecurrenceRuleState,
): InterfaceRecurrenceRule => {
  const {
    recurrenceStartDate,
    recurrenceEndDate,
    frequency,
    weekDays,
    interval,
    count,
    weekDayOccurenceInMonth,
  } = recurrenceRuleState;

  const originalRecurrencerule = {
    recurrenceStartDate: dayjs(recurrenceStartDate).format('YYYY-MM-DD'),
    recurrenceEndDate: recurrenceEndDate
      ? dayjs(recurrenceEndDate).format('YYYY-MM-DD')
      : null,
    frequency,
    weekDays: weekDays?.length ? weekDays : [],
    interval,
    count: count ?? null,
    weekDayOccurenceInMonth: weekDayOccurenceInMonth ?? null,
  };

  return originalRecurrencerule;
};

// function to check whether recurrence weekDays have been changed
const weekDaysHaveChanged = (
  originalWeekDays: WeekDays[],
  currentWeekDays: WeekDays[],
): boolean => {
  if (originalWeekDays.length !== currentWeekDays.length) {
    return true;
  }

  // Sort both arrays
  const sortedOriginalWeekDays = [...originalWeekDays].sort();
  const sortedCurrentWeekDays = [...currentWeekDays].sort();

  // Compare arrays
  for (let i = 0; i < sortedOriginalWeekDays.length; i++) {
    if (sortedOriginalWeekDays[i] !== sortedCurrentWeekDays[i]) {
      return true;
    }
  }

  return false;
};
