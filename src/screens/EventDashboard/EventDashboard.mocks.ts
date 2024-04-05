<<<<<<< HEAD
import { EVENT_DETAILS, EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
=======
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1

const constantMocks = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: 'event123',
      },
    },
    result: {
      data: {
        event: {
          _id: 'event123',
          feedback: [],
          averageFeedbackScore: 0,
        },
      },
    },
  },
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        event: {
          _id: '',
          feedback: [],
          averageFeedbackScore: 0,
        },
      },
    },
  },
  {
    request: {
      query: EVENT_DETAILS,
      variables: {
        id: '',
      },
    },
    result: {
      data: {
        event: {
          _id: '',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
          endDate: '2/2/23',
          startTime: '08:00:00',
          endTime: '09:00:00',
          allDay: false,
          location: 'India',
          organization: {
            _id: '',
            members: [],
          },
          attendees: [],
<<<<<<< HEAD
=======
          projects: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
];

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
          _id: 'event123',
          title: 'Event Title',
          description: 'Event Description',
          startDate: '1/1/23',
<<<<<<< HEAD
          endDate: '16/2/23',
=======
          endDate: '2/2/23',
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
          startTime: '08:00:00',
          endTime: '09:00:00',
          allDay: false,
          location: 'India',
          organization: {
            _id: 'org1',
            members: [{ _id: 'user1', firstName: 'John', lastName: 'Doe' }],
          },
          attendees: [{ _id: 'user1' }],
<<<<<<< HEAD
=======
          projects: [],
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
  ...constantMocks,
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
          _id: 'event123',
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
            members: [{ _id: 'user1', firstName: 'John', lastName: 'Doe' }],
          },
          attendees: [{ _id: 'user1' }],
<<<<<<< HEAD
=======
          projects: [],
        },
      },
    },
  },
  ...constantMocks,
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
          _id: 'event123',
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
            members: [{ _id: 'user1', firstName: 'John', lastName: 'Doe' }],
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
  ...constantMocks,
];

// Mock 4
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
          _id: 'event123',
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
            members: [{ _id: 'user1', firstName: 'John', lastName: 'Doe' }],
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
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
        },
      },
    },
  },
  ...constantMocks,
];
