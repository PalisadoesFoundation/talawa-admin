/*
   Recurrence utility functions
*/

import { dayNames, mondayToFriday, monthNames } from './recurrenceConstants';
import { Frequency } from './recurrenceTypes';
import type { WeekDays, InterfaceRecurrenceRule } from './recurrenceTypes';

// function that generates the recurrence rule text to display
// e.g. - 'Weekly on Sunday, until Feburary 23, 2029'
export const getRecurrenceRuleText = (
  recurrenceRuleState: InterfaceRecurrenceRule,
  startDate: Date,
  endDate: Date | null,
): string => {
  let recurrenceRuleText = '';
  const { frequency, weekDays, count } = recurrenceRuleState;

  switch (frequency) {
    case Frequency.DAILY:
      recurrenceRuleText = 'Daily';
      break;
    case Frequency.WEEKLY:
      if (isMondayToFriday(weekDays)) {
        recurrenceRuleText = 'Monday to Friday';
        break;
      }
      recurrenceRuleText = 'Weekly on ';
      recurrenceRuleText += getWeekDaysString(weekDays);
      break;
    case Frequency.MONTHLY:
      recurrenceRuleText = 'Monthly on ';
      recurrenceRuleText += `Day ${startDate.getDate()}`;
      break;
    case Frequency.YEARLY:
      recurrenceRuleText = 'Annually on ';
      recurrenceRuleText += `${monthNames[startDate.getMonth()]} ${startDate.getDate()}`;
      break;
  }

  if (endDate) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    recurrenceRuleText += `, until  ${endDate.toLocaleDateString('en-US', options)}`;
  }

  if (count) {
    recurrenceRuleText += `, ${count} times`;
  }

  return recurrenceRuleText;
};

// function that generates a string of selected week days for the recurrence rule text
// e.g. - for an array ['MO', 'TU', 'FR'], it would output: 'Monday, Tuesday & Friday'
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
