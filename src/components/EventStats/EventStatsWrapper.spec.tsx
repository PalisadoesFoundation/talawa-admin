import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStatsWrapper } from './EventStatsWrapper';
import { BrowserRouter } from 'react-router';
import { mockData } from './EventStatsMocks';
import { vi, describe, expect, it } from 'vitest';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Vitest)
// These modules are used by the Feedback component
vi.mock('@mui/x-charts/PieChart', () => ({
  PieChart: () => <div data-testid="mocked-pie-chart">Test</div>,
  pieArcClasses: { faded: 'faded-class' },
  pieArcLabelClasses: { root: 'label-root-class', faded: 'label-faded-class' },
}));

describe('Testing Event Stats Wrapper', () => {
  const props = {
    _id: 'eventStats123',
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
    fireEvent.click(queryByRole('button', { name: /close/i }) as Element);
    await waitFor(() =>
      expect(queryByText('Event Statistics')).not.toBeInTheDocument(),
    );
  });
});
