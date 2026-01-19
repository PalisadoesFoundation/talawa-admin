import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { EventStats } from './EventStats';
import { BrowserRouter } from 'react-router';
import { mockData } from '../EventStatsMocks';
import { vi, describe, expect, it } from 'vitest';

// Mock the modules for PieChart rendering as they require a trasformer being used (which is not done by Vitest)
// These modules are used by the Feedback component
vi.mock('@mui/x-charts/PieChart', async () => ({
  PieChart: () => <div data-testid="mocked-pie-chart">Test</div>,
  pieArcClasses: { faded: 'faded-class' },
  pieArcLabelClasses: { root: 'label-root-class', faded: 'label-faded-class' },
}));

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      tCommon: (key: string) => key,
      tErrors: (key: string) => key,
    }),
  };
});

describe('Testing Event Stats', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });
  const props = {
    eventId: 'eventStats123',
    show: true,
    handleClose: vi.fn(),
  };

  it('The stats should be rendered properly', async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStats {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByText('Feedback Analysis')).toBeInTheDocument();
    });
  });
});
