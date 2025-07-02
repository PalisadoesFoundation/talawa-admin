import {
  DELETE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
} from 'GraphQl/Mutations/mutations';
import { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';

export const eventData = [
  {
    _id: '1',
    name: 'Event 1',
    description: 'This is event 1',
    startDate: '2022-05-01',
    endDate: '2022-05-01',
    location: 'New York',
    startTime: '10:00',
    endTime: '12:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    viewType: ViewType.DAY,
    attendees: [],
    creator: {},
  },
  {
    _id: '2',
    name: 'Event 2',
    description: 'This is event 2',
    startDate: '2022-05-03',
    endDate: '2022-05-03',
    location: 'Los Angeles',
    startTime: '14:00',
    endTime: '16:00',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    attendees: [],
    creator: {},
  },
];

export const MOCKS = [
  {
    request: {
      query: DELETE_EVENT_MUTATION,
      variable: { id: '123' },
    },
    result: {
      data: {
        removeEvent: {
          _id: '1',
        },
      },
    },
  },
  {
    request: {
      query: UPDATE_EVENT_MUTATION,
      variable: {
        id: '123',
        name: 'Updated name',
        description: 'This is a new update',
        isPublic: true,
        isRegisterable: true,
        allDay: false,
        location: 'New Delhi',
        startTime: '02:00',
        endTime: '07:00',
      },
    },
    result: {
      data: {
        updateEvent: {
          _id: '1',
        },
      },
    },
  },
];
