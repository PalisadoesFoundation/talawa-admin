import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router-dom';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';
import { vi, describe, expect, it } from 'vitest';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Vitest)
// These modules are used by the Feedback component
vi.mock('@mui/x-charts/PieChart', async () => ({
  ...(await vi.importActual('@mui/x-charts/PieChart')),
  pieArcLabelClasses: vi.fn(),
  PieChart: vi.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: vi.fn(),
}));

const mockData = [
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

describe('Testing Event Stats Wrapper', () => {
  const props = {
    eventId: 'eventStats123',
  };

  it('The button to open and close the modal should work properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData} addTypename={false}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    // Open the modal
    fireEvent.click(queryByText('View Event Statistics') as Element);

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );

    // Close the modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );
  });
});
