import type { InterfaceEvent } from 'types/Event/interface';

interface IEventListCardProps extends InterfaceEvent {
  refetchEvents?: () => void;
}

export const props: IEventListCardProps[] = [
  {
    key: '',
    _id: '',
    location: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    allDay: false,
    isPublic: false,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
    startTime: '02:00',
    endTime: '06:00',
    allDay: false,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    userRole: 'REGULAR',
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
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
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    userRole: 'REGULAR',
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Dogs',
    description: 'This is shelter for dogs event',
    startDate: '2022-03-19',
    endDate: '2022-03-26',
    startTime: '02:00',
    endTime: '06:00',
    allDay: true,
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
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    userRole: 'ADMINISTRATOR',
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-19',
    endDate: '2022-03-19',
    startTime: '09:00:00',
    endTime: '17:00:00',
    allDay: false,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    userRole: 'ADMINISTRATOR',
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-17',
    endDate: '2022-03-17',
    startTime: null,
    endTime: null,
    allDay: true,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
  {
    userRole: 'ADMINISTRATOR',
    key: '123',
    _id: '1',
    location: 'India',
    name: 'Shelter for Cats',
    description: 'This is shelter for cat event',
    startDate: '2022-03-17',
    endDate: '2022-03-17',
    startTime: null,
    endTime: null,
    allDay: true,
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
    // Recurring event fields
    isRecurringTemplate: false,
    baseEventId: null,
    sequenceNumber: null,
    totalCount: null,
    hasExceptions: false,
    progressLabel: null,
  },
];
