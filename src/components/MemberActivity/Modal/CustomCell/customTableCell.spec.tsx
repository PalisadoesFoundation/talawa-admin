import React from 'react';
import { describe, it, expect, vi } from 'vitest';
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
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    expect(screen.getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(screen.getByText('Loading event details')).toBeInTheDocument();
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
    mockUseQuery.mockReturnValue({
      loading: false,
      data: {
        event: {
          _id: 'e1',
          title: 'Event',
          startDate: new Date().toISOString(),
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
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('/event/'),
    );
    expect(screen.getByTestId('custom-row')).toBeInTheDocument();
  });
});
