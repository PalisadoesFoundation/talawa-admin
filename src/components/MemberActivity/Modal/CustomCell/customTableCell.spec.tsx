import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router';
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
        new Date('2030-01-01').toLocaleDateString(undefined, {
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
          variables: { eventId: 'event999' },
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
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: null,
          },
        },
      },
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event999' },
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
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event999" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByText('Event not found or has been deleted'),
      ).toBeInTheDocument();
    });
  });

  it('displays non-recurring event correctly', async () => {
    const nonRecurringEventMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event456' },
        },
        result: {
          data: {
            event: {
              id: 'event456',
              name: 'Non-Recurring Event',
              startAt: '2030-02-01T10:00:00.000Z',
              isRecurringEventTemplate: false,
              attendees: [
                { id: 'user1', gender: 'MALE' },
                { id: 'user2', gender: 'FEMALE' },
                { id: 'user3', gender: 'OTHER' },
              ],
              organization: { id: 'org456', name: 'Test Org 2' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={nonRecurringEventMock} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event456" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(screen.getByText('Non-Recurring Event')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Non-Recurring Event' });
    expect(link).toHaveAttribute('href', '/event/org456/event456');
  });

  it('displays event with no attendees correctly', async () => {
    const noAttendeesMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event789' },
        },
        result: {
          data: {
            event: {
              id: 'event789',
              name: 'Event with No Attendees',
              startAt: '2030-03-01T14:00:00.000Z',
              isRecurringEventTemplate: true,
              attendees: null,
              organization: { id: 'org789', name: 'Test Org 3' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={noAttendeesMock} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event789" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(screen.getByText('Event with No Attendees')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays event with empty attendees array correctly', async () => {
    const emptyAttendeesMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event000' },
        },
        result: {
          data: {
            event: {
              id: 'event000',
              name: 'Event with Empty Attendees',
              startAt: '2030-04-01T16:00:00.000Z',
              isRecurringEventTemplate: false,
              attendees: [],
              organization: { id: 'org000', name: 'Test Org 4' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={emptyAttendeesMock} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event000" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(screen.getByText('Event with Empty Attendees')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays event with undefined attendees correctly', async () => {
    const undefinedAttendeesMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event111' },
        },
        result: {
          data: {
            event: {
              id: 'event111',
              name: 'Event with Undefined Attendees',
              startAt: '2030-05-01T12:00:00.000Z',
              isRecurringEventTemplate: true,
              // attendees property is undefined
              organization: { id: 'org111', name: 'Test Org 5' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={undefinedAttendeesMock} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event111" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(
      screen.getByText('Event with Undefined Attendees'),
    ).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays correct date format for different timezone', async () => {
    const dateTestMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event222' },
        },
        result: {
          data: {
            event: {
              id: 'event222',
              name: 'Date Test Event',
              startAt: '2030-12-25T23:59:59.000Z',
              isRecurringEventTemplate: false,
              attendees: [{ id: 'user1', gender: 'MALE' }],
              organization: { id: 'org222', name: 'Test Org 6' },
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={dateTestMock} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event222" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => screen.getByTestId('custom-row'));

    expect(screen.getByText('Date Test Event')).toBeInTheDocument();
    expect(
      screen.getByText(
        new Date('2030-12-25T23:59:59.000Z').toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          timeZone: 'UTC',
        }),
      ),
    ).toBeInTheDocument();
  });
});
