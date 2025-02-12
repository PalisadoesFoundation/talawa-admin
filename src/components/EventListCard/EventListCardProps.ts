import { Frequency, WeekDays } from 'utils/recurrenceUtils';
import type { InterfaceEventListCardProps } from 'types/Event/interface';

interface InterfaceEventListCard extends InterfaceEventListCardProps {
  refetchEvents?: () => void;
}

export const props: InterfaceEventListCard[] = [
  {
    key: '',
    _id: '',
    location: '',
    title: '',
    description: '',
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
    _id: '1',
    location: 'India',
    title: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
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
    userRole: 'USER',
    key: '123',
    _id: '1',
    location: 'India',
    title: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
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
    attendees: [
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
    _id: '1',
    location: 'India',
    title: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
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
    attendees: [
      {
        _id: '456',
      },
    ],
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
  {
    userRole: 'ADMIN',
    key: '123',
    _id: '1',
    location: 'India',
    title: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-19',
    endDate: '2022-03-19',
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
    userRole: 'ADMIN',
    key: '123',
    _id: '1',
    location: 'India',
    title: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-17',
    endDate: '2022-03-17',
    startTime: null,
    endTime: null,
    allDay: true,
    recurring: true,
    recurrenceRule: {
      recurrenceStartDate: '2022-03-17',
      recurrenceEndDate: null,
      frequency: Frequency.MONTHLY,
      weekDays: [WeekDays.THURSDAY],
      interval: 1,
      count: null,
      weekDayOccurenceInMonth: 3,
    },
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
    _id: '1',
    location: 'India',
    title: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-17',
    endDate: '2022-03-17',
    startTime: null,
    endTime: null,
    allDay: true,
    recurring: true,
    recurrenceRule: {
      recurrenceStartDate: '2022-03-17',
      recurrenceEndDate: '2023-03-17',
      frequency: Frequency.MONTHLY,
      weekDays: [WeekDays.THURSDAY],
      interval: 1,
      count: null,
      weekDayOccurenceInMonth: 3,
    },
    isRecurringEventException: false,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
  },
];
