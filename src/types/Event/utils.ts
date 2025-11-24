export interface InterfaceHoliday {
  name: string;
  date: string; // Format: MM-DD
  month: string;
}

export const holidays: InterfaceHoliday[] = [
  { name: 'May Day / Labour Day', date: '05-01', month: 'May' },
  { name: "Mother's Day", date: '05-08', month: 'May' },
  { name: "Father's Day", date: '06-19', month: 'June' },
  { name: 'Independence Day (US)', date: '07-04', month: 'July' },
  { name: 'Oktoberfest', date: '09-21', month: 'September' },
  { name: 'Halloween', date: '10-31', month: 'October' },
  { name: 'Diwali', date: '11-04', month: 'November' },
  { name: 'Remembrance Day / Veterans Day', date: '11-11', month: 'November' },
  { name: 'Christmas Day', date: '12-25', month: 'December' },
];

export const weekdays: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const months: string[] = [
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
