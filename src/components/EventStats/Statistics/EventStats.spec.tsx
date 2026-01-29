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
      t: (key: string, options?: { count?: number }) => {
        // Handle eventStats.feedback translations
        if (key === 'title') return 'Feedback Analysis';
        if (key === 'emptyState')
          return 'Please ask attendees to submit feedback for insights!';
        if (key === 'filledByCount' && options?.count !== undefined)
          return `${options.count} people have filled feedback for this event.`;
        return key;
      },
      tCommon: (key: string) => key,
      tErrors: (key: string) => key,
    }),
  };
});

describe('Testing Event Stats', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  const props = {
    eventId: 'eventStats123',
    show: true,
    handleClose: vi.fn(),
  };

  it('The stats should be rendered properly', async () => {
    const { getAllByText } = render(
      <MockedProvider mocks={mockData}>
        <BrowserRouter>
          <EventStats {...props} />
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      const elements = getAllByText('Feedback Analysis');
      // Should find at least one element (may be duplicated by React StrictMode)
      expect(elements.length).toBeGreaterThanOrEqual(1);
      expect(elements[0]).toBeInTheDocument();
    });
  });
});
