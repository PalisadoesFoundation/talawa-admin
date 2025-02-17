import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import { CustomTableCell } from './customTableCell';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import { vi } from 'vitest';
import { mocks } from '../../MemberActivityMocks';
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CustomTableCell', () => {
  it('renders event details correctly', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event123" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date('2023-01-01').toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }),
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Test Event' });
    expect(link).toHaveAttribute('href', '/event/org123/event123');
  });

  it('displays loading state', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <table>
          <tbody>
            <CustomTableCell eventId="event123" />
          </tbody>
        </table>
      </MockedProvider>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const errorMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { id: 'event123' },
        },
        error: new Error('An error occurred'),
      },
    ];

    render(
      <MockedProvider mocks={errorMock} addTypename={false}>
        <table>
          <tbody>
            <CustomTableCell eventId="event123" />
          </tbody>
        </table>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Unable to load event details. Please try again later.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('displays no event found message', async () => {
    const noEventMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { id: 'event123' },
        },
        result: {
          data: {
            event: null,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noEventMock} addTypename={false}>
        <table>
          <tbody>
            <CustomTableCell eventId="event123" />
          </tbody>
        </table>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Event not found or has been deleted'),
      ).toBeInTheDocument();
    });
  });
});
