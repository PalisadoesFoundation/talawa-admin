import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router-dom';
import { EVENT_FEEDBACKS, EVENT_FEEDBACK_SCORE } from 'GraphQl/Queries/Queries';
import { InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache({
  typePolicies: {
    'Query.event': {
      merge: true,
    },
  },
});

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

const mockData = [
  {
    request: {
      query: EVENT_FEEDBACKS,
      variables: {
        id: 'eventStatsWrapper123',
      },
    },
    result: {
      data: {
        event: {
          _id: 'eventStatsWrapper123',
          feedback: [
            {
              _id: 'feedback1',
              review: 'review1',
              rating: 5,
            },
          ],
        },
      },
    },
  },
  {
    request: {
      query: EVENT_FEEDBACK_SCORE,
      variables: {
        id: 'eventStatsWrapper123',
      },
    },
    result: {
      data: {
        event: {
          _id: 'eventStatsWrapper123',
          averageFeedbackScore: 5,
        },
      },
    },
  },
];

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// These modules are used by the Feedback component
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

describe('Testing Event Stats Wrapper', () => {
  const props = {
    eventId: 'eventStatsWrapper123',
  };

  test('The button to open and close the modal should work properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData} cache={cache}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    // Open the modal
    fireEvent.click(queryByText('View Event Statistics') as Element);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument()
    );

    // Close the modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument()
    );
  });
});
