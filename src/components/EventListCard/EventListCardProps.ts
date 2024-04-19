import { Frequency, WeekDays } from 'utils/recurrenceUtils';
import type { InterfaceEventListCardProps } from './EventListCard';

export const props: InterfaceEventListCardProps[] = [
  {
    key: '',
    id: '',
    eventLocation: '',
    eventName: '',
    eventDescription: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    allDay: false,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: false,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
  {
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    startDate: '03/19/2022',
    endDate: '03/26/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: false,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
  {
    userRole: 'ADMIN',
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Cats',
    eventDescription: 'This is shelter for cat event',
    startDate: '19/03/2022',
    endDate: '19/03/2022',
    startTime: '2:00',
    endTime: '6:00',
    allDay: false,
    recurring: true,
    recurrenceRule: {
      recurrenceStartDate: '2022-03-19',
      recurrenceEndDate: '2022-03-26',
      frequency: Frequency.WEEKLY,
      weekDays: [WeekDays.SATURDAY],
      interval: 1,
      count: null,
      weekDayOccurenceInMonth: null,
    },
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
  {
    userRole: 'USER',
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    startDate: '19/03/2022',
    endDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      _id: '123',
    },
    registrants: [
      {
        _id: '234',
      },
    ],
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
  {
    userRole: 'USER',
    key: '123',
    id: '1',
    eventLocation: 'India',
    eventName: 'Shelter for Dogs',
    eventDescription: 'This is shelter for dogs event',
    startDate: '19/03/2022',
    endDate: '26/03/2022',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
    recurring: false,
    recurrenceRule: null,
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
    creator: {
      firstName: 'Joe',
      lastName: 'David',
      _id: '123',
    },
    registrants: [
      {
        _id: '456',
      },
    ],
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
];
