/*
  Recurrence types
*/

// interface for the recurrenceRuleData that we would send to the backend
export interface InterfaceRecurrenceRule {
  frequency: Frequency;
  weekDays: WeekDays[];
  count: number | undefined;
}

// recurrence frequency
export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

// recurrence frequency mapping
export const frequencies = {
  [Frequency.DAILY]: 'Day',
  [Frequency.WEEKLY]: 'Week',
  [Frequency.MONTHLY]: 'Month',
  [Frequency.YEARLY]: 'Year',
};

// recurrence week days
export enum WeekDays {
  SU = 'SU',
  MO = 'MO',
  TU = 'TU',
  WE = 'WE',
  TH = 'TH',
  FR = 'FR',
  SA = 'SA',
}

// recurrence end options
// i.e. whether it 'never' ends, ends 'on' a certain date, or 'after' a certain number of occurences
export enum RecurrenceEndOption {
  never = 'never',
  on = 'on',
  after = 'after',
}

/*
  Recurrence constants
*/

// recurrence days options to select from in the UI
export const daysOptions = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

// recurrence days array
export const Days = [
  WeekDays.SU,
  WeekDays.MO,
  WeekDays.TU,
  WeekDays.WE,
  WeekDays.TH,
  WeekDays.FR,
  WeekDays.SA,
];

// recurrence end options array
export const recurrenceEndOptions = [
  RecurrenceEndOption.never,
  RecurrenceEndOption.on,
  RecurrenceEndOption.after,
];

// constants for recurrence end options
export const endsNever = RecurrenceEndOption.never;
export const endsOn = RecurrenceEndOption.on;
export const endsAfter = RecurrenceEndOption.after;

// array of week days containing 'MO' to 'FR
export const mondayToFriday = Days.filter(
  (day) => day !== WeekDays.SA && day !== WeekDays.SU,
);

// names of week days
const dayNames = {
  [WeekDays.SU]: 'Sunday',
  [WeekDays.MO]: 'Monday',
  [WeekDays.TU]: 'Tuesday',
  [WeekDays.WE]: 'Wednesday',
  [WeekDays.TH]: 'Thursday',
  [WeekDays.FR]: 'Friday',
  [WeekDays.SA]: 'Saturday',
};

// names of months
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/*
   Recurrence utility functions
*/
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
