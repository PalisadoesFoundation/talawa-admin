import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStats } from './EventStats';
import { BrowserRouter } from 'react-router-dom';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Jest)
// These modules are used by the Feedback component
jest.mock('@mui/x-charts/PieChart', () => ({
  pieArcLabelClasses: jest.fn(),
  PieChart: jest.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: jest.fn(),
}));

describe('Testing Event Stats', () => {
  const props = {
    eventId: 'event123',
    show: true,
    handleClose: jest.fn(),
  };

  test('The stats should be rendered properly', async () => {
    const { queryByText } = render(
      <MockedProvider addTypename={false}>
        <BrowserRouter>
          <EventStats {...props} />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument()
    );
  });
});
