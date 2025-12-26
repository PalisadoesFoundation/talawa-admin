export const eventData = [
  {
    id: '1',
    name: 'Event 1',
    description: 'This is event 1',
    startAt: '2022-05-01T10:00:00Z',
    endAt: '2022-05-01T12:00:00Z',
    location: 'New York',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {},
  },
  {
    id: '2',
    name: 'Event 2',
    description: 'This is event 2',
    startAt: '2022-05-03T14:00:00Z',
    endAt: '2022-05-03T16:00:00Z',
    location: 'Los Angeles',
    allDay: false,
    isPublic: true,
    isRegisterable: true,
    isInviteOnly: false,
    attendees: [],
    creator: {},
  },
];

// Empty mocks array - EventCalendar component only displays eventData passed as props
// and does not trigger any GraphQL queries or mutations
export const MOCKS = [];
