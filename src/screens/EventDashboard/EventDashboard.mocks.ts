import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';

// Mock 1
export const queryMockWithTime = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: {
        id: 'event123',
      },
    },
    result: {
      data: {
        event: {
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
          endDate: '2/2/23',
          startTime: '08:00:00',
          endTime: '09:00:00',
          allDay: false,
          location: 'India',
          organization: {
            _id: 'org1',
            members: [],
          },
          attendees: [{ _id: 'user1' }],
          projects: [],
        },
      },
    },
  },
];

// Mock 2
export const queryMockWithoutTime = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: {
        id: 'event123',
      },
    },
    result: {
      data: {
        event: {
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
          endDate: '2/2/23',
          startTime: null,
          endTime: null,
          allDay: false,
          location: 'India',
          organization: {
            _id: 'org1',
            members: [],
          },
          attendees: [{ _id: 'user1' }],
          projects: [],
        },
      },
    },
  },
];

// Mock 3
export const queryMockWithProject = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: {
        id: 'event123',
      },
    },
    result: {
      data: {
        event: {
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
          endDate: '2/2/23',
          startTime: '08:00:00',
          endTime: '09:00:00',
          allDay: false,
          location: 'India',
          organization: {
            _id: 'org1',
            members: [],
          },
          attendees: [{ _id: 'user1' }],
          projects: [
            {
              _id: 'project1',
              title: 'Project 1',
              description: 'Project Description 1',
              tasks: [],
            },
          ],
        },
      },
    },
  },
];

// Mock $
export const queryMockWithProjectAndTask = [
  {
    request: {
      query: EVENT_DETAILS,
      variables: {
        id: 'event123',
      },
    },
    result: {
      data: {
        event: {
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
          endDate: '2/2/23',
          startTime: '08:00:00',
          endTime: '09:00:00',
          allDay: false,
          location: 'India',
          organization: {
            _id: 'org1',
            members: [],
          },
          attendees: [{ _id: 'user1' }],
          projects: [
            {
              _id: 'project1',
              title: 'Project 1',
              description: 'Project Description 1',
              tasks: [
                {
                  _id: 'task1',
                  title: 'Task 1',
                  description: 'Description 1',
                  deadline: '22/12/23',
                  completed: false,
                  volunteers: [],
                },
              ],
            },
          ],
        },
      },
    },
  },
];
