import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStats } from './EventStats';
import { BrowserRouter } from 'react-router-dom';
import { mockData } from '../EventStatsMocks';
import { vi, describe, expect, it } from 'vitest';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Vitest)
// These modules are used by the Feedback component
vi.mock('@mui/x-charts/PieChart', async () => ({
  ...(await vi.importActual('@mui/x-charts/PieChart')),
  pieArcLabelClasses: vi.fn(),
  PieChart: vi.fn().mockImplementation(() => <>Test</>),
  pieArcClasses: vi.fn(),
}));

describe('Testing Event Stats', () => {
  const props = {
    eventId: 'eventStats123',
    show: true,
    handleClose: vi.fn(),
  };

  it('The stats should be rendered properly', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mockData} addTypename={false}>
        <BrowserRouter>
          <EventStats {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Event Statistics')).toBeInTheDocument(),
    );
  });
});
