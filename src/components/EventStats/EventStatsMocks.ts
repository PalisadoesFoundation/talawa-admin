import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

export const mockData = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: 'eventStats123',
      },
    },
    result: {
      data: {
        event: {
          _id: 'eventStats123',
          feedback: [
            {
              _id: 'feedback1',
              review: 'review1',
              rating: 5,
            },
          ],
          averageFeedbackScore: 5,
        },
      },
    },
  },
  {
    // Covers renders where _id prop is empty
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
    // Covers rerender with a different id value
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: 'differentId',
      },
    },
    result: {
      data: {
        event: {
          _id: 'differentId',
          feedback: [
            {
              _id: 'feedback2',
              review: 'review2',
              rating: 4,
            },
          ],
          averageFeedbackScore: 4,
        },
      },
    },
  },
];

export const nonEmptyProps = {
  data: {
    event: {
      _id: '123',
      feedback: [
        {
          _id: 'feedback1',
          review: 'review1',
          rating: 5,
          createdAt: new Date('2021-08-10T10:00:00.000Z'),
          updatedAt: new Date('2021-08-10T10:00:00.000Z'),
        },
        {
          _id: 'feedback2',
          review: 'review2',
          rating: 5,
          createdAt: new Date('2021-08-10T10:00:00.000Z'),
          updatedAt: new Date('2021-08-10T10:00:00.000Z'),
        },
        {
          _id: 'feedback3',
          review: null,
          rating: 5,
          createdAt: new Date('2021-08-10T10:00:00.000Z'),
          updatedAt: new Date('2021-08-10T10:00:00.000Z'),
        },
      ],
      averageFeedbackScore: 5,
    },
  },
};

export const emptyProps = {
  data: {
    event: {
      _id: '123',
      feedback: [],
      averageFeedbackScore: 0,
    },
  },
};

export const diverseRatingsProps = {
  data: {
    event: {
      _id: '123',
      feedback: [
        {
          _id: 'feedback1',
          review: 'Excellent event!',
          rating: 5,
          createdAt: new Date('2021-08-10T10:00:00.000Z'),
          updatedAt: new Date('2021-08-10T10:00:00.000Z'),
        },
        {
          _id: 'feedback2',
          review: 'Good overall',
          rating: 3,
          createdAt: new Date('2021-08-10T11:00:00.000Z'),
          updatedAt: new Date('2021-08-10T11:00:00.000Z'),
        },
        {
          _id: 'feedback3',
          review: 'Average experience',
          rating: 3,
          createdAt: new Date('2021-08-10T12:00:00.000Z'),
          updatedAt: new Date('2021-08-10T12:00:00.000Z'),
        },
        {
          _id: 'feedback4',
          review: 'Poor event',
          rating: 1,
          createdAt: new Date('2021-08-10T13:00:00.000Z'),
          updatedAt: new Date('2021-08-10T13:00:00.000Z'),
        },
        {
          _id: 'feedback5',
          review: 'Terrible',
          rating: 0,
          createdAt: new Date('2021-08-10T14:00:00.000Z'),
          updatedAt: new Date('2021-08-10T14:00:00.000Z'),
        },
      ],
      averageFeedbackScore: 2.4,
    },
  },
};
