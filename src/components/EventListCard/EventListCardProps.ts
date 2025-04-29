import type { InterfaceEvent } from 'types/Event/interface';

interface InterfaceEventListCard extends InterfaceEvent {
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

    isPublic: false,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
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
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
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

    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
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
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
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
    isPublic: true,
    isRegisterable: false,
    refetchEvents: (): void => {
      /* refetch function */
    },
    attendees: [],
    creator: {},
  },
];
