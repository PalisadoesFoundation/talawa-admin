import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CustomTableCell } from './customTableCell';

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock('@apollo/client', () => ({
  useQuery: (...args: any[]) => mockUseQuery(...args),
}));

vi.mock('react-router', async (orig: any) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    Link: ({ to, children }: any) => <a href={to}>{children}</a>,
  };
});

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<any>('react-i18next');
  return { ...actual, useTranslation: vi.fn(() => ({ t: (k: string) => k })) };
});

// Ensure hoisted mock state doesn't leak between tests
afterEach(() => {
  vi.resetAllMocks();
});

describe('CustomTableCell', () => {
  it('shows loading row', () => {
    mockUseQuery.mockReturnValue({ loading: true });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e1" />
        </tbody>
      </table>,
    );
    const loadingRow = screen.getByTestId('loading-state');
    expect(loadingRow).toBeInTheDocument();
    const spinnerWrapper = screen.getByTestId('spinner-wrapper');
    expect(spinnerWrapper).toBeInTheDocument();
    expect(screen.getByText('Loading event details')).toBeInTheDocument();
    // Accessibility: live region present
    const liveRegion = loadingRow.querySelector('[role="status"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    // Accessibility: table cell marked busy
    const busyCell = loadingRow.querySelector('[aria-busy="true"]');
    expect(busyCell).not.toBeNull();
  });

  it('respects a custom colSpan in loading state', () => {
    mockUseQuery.mockReturnValue({ loading: true });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e2" colSpan={7} />
        </tbody>
      </table>,
    );
    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('colspan', '7');
  });

  it('shows error row', () => {
    mockUseQuery.mockReturnValue({ loading: false, error: new Error('x') });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e1" />
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(
      screen.getByText('Unable to load event details. Please try again later.'),
    ).toBeInTheDocument();
  });

  it('shows no event row', () => {
    mockUseQuery.mockReturnValue({ loading: false, data: { event: null } });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e1" />
        </tbody>
      </table>,
    );
    expect(screen.getByTestId('no-event-state')).toBeInTheDocument();
  });

  it('renders event details', () => {
    const isoDate = '2025-01-15T00:00:00.000Z';
    mockUseQuery.mockReturnValue({
      loading: false,
      data: {
        event: {
          _id: 'e1',
          title: 'Event',
          startDate: isoDate,
          recurring: false,
          attendees: [],
          organization: { _id: 'o1' },
        },
      },
    });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e1" />
        </tbody>
      </table>,
    );
    expect(screen.getByText('Event')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/event/o1/e1');
    const expectedDateText = new Date(isoDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    });
    expect(screen.getByText(expectedDateText)).toBeInTheDocument();
    expect(screen.getByTestId('custom-row')).toBeInTheDocument();
    // useQuery option verification
    const call = mockUseQuery.mock.calls[0];
    expect(call[1]).toMatchObject({
      variables: { id: 'e1' },
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      pollInterval: 30000,
    });
    // Attendees length 0 displayed (explicit array path)
    expect(screen.getByTitle('Number of attendees').textContent).toBe('0');
  });

  it('renders recurring event and attendees fallback when undefined', () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      data: {
        event: {
          _id: 'e5',
          title: 'Recurring Event',
          startDate: '2025-05-20T00:00:00.000Z',
          recurring: true,
          // attendees intentionally omitted to trigger fallback (undefined)
          organization: { _id: 'org5' },
        },
      },
    });
    render(
      <table>
        <tbody>
          <CustomTableCell eventId="e5" />
        </tbody>
      </table>,
    );
    expect(screen.getByText('Recurring Event')).toBeInTheDocument();
    // Recurring flag 'Yes'
    expect(screen.getAllByText('Yes').length).toBeGreaterThan(0);
    // Fallback attendee count 0 (undefined -> 0)
    expect(screen.getByTitle('Number of attendees').textContent).toBe('0');
  });
});
