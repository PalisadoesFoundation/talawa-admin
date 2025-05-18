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
