export interface InterfaceRecurrenceRule {
  frequency: Frequency;
  weekDays: WeekDays[];
  count: number | undefined;
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export const frequencies = {
  [Frequency.DAILY]: 'Day',
  [Frequency.WEEKLY]: 'Week',
  [Frequency.MONTHLY]: 'Month',
  [Frequency.YEARLY]: 'Year',
};

export enum WeekDays {
  SU = 'SU',
  MO = 'MO',
  TU = 'TU',
  WE = 'WE',
  TH = 'TH',
  FR = 'FR',
  SA = 'SA',
}

export const Days = [
  WeekDays.SU,
  WeekDays.MO,
  WeekDays.TU,
  WeekDays.WE,
  WeekDays.TH,
  WeekDays.FR,
  WeekDays.SA,
];

const dayNames = {
  [WeekDays.SU]: 'Sunday',
  [WeekDays.MO]: 'Monday',
  [WeekDays.TU]: 'Tuesday',
  [WeekDays.WE]: 'Wednesday',
  [WeekDays.TH]: 'Thursday',
  [WeekDays.FR]: 'Friday',
  [WeekDays.SA]: 'Saturday',
};

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
