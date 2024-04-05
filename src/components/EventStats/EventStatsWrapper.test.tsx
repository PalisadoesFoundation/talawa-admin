import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router-dom';
import { EVENT_FEEDBACKS } from 'GraphQl/Queries/Queries';

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

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// These modules are used by the Feedback component
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

describe('Testing Event Stats Wrapper', () => {
  const props = {
    eventId: 'eventStats123',
  };

  test('The button to open and close the modal should work properly', async () => {
    const { queryByText, queryByRole } = render(
      <MockedProvider mocks={mockData} addTypename={false}>
        <BrowserRouter>
          <EventStatsWrapper {...props} />
        </BrowserRouter>
<<<<<<< HEAD
      </MockedProvider>,
=======
      </MockedProvider>
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    // Open the modal
    fireEvent.click(queryByText('View Event Statistics') as Element);

    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
=======
      expect(queryByText('Event Statistics')).toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );

    // Close the modal
    fireEvent.click(queryByRole('button', { name: /close/i }) as HTMLElement);
    await waitFor(() =>
<<<<<<< HEAD
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
=======
      expect(queryByText('Event Statistics')).not.toBeInTheDocument()
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
    );
  });
});
