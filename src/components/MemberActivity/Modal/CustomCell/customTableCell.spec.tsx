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

  it('displays no event found message with proper styling', async () => {
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
      // Test the text content
      expect(
        screen.getByText('Event not found or has been deleted'),
      ).toBeInTheDocument();

      // Test the styling and structure
      const noEventRow = screen.getByTestId('no-event-state');
      expect(noEventRow).toBeInTheDocument();

      const tableCell = noEventRow.querySelector('td');
      expect(tableCell).toHaveAttribute('colspan', '4');
      expect(tableCell).toHaveClass('MuiTableCell-alignCenter');
      expect(tableCell).toHaveTextContent(
        'Event not found or has been deleted',
      );
    });
  });

  it('renders recurring status and attendee count correctly', async () => {
    // Test both recurring=true and with attendees
    const eventMock = {
      request: {
        query: EVENT_DETAILS,
        variables: { id: 'event123' },
      },
      result: {
        data: {
          event: {
            _id: 'event123',
            title: 'Test Event',
            startDate: '2023-05-15',
            organization: { _id: 'org1' },
            recurring: true,
            attendees: [{ _id: 'user1' }, { _id: 'user2' }],
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[eventMock]} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event123" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for query to complete
    await waitFor(() => {
      // Check recurring status shows "Yes"
      expect(screen.getByText('Yes')).toBeInTheDocument();

      // Check attendee count shows "2"
      const attendeeCount = screen.getByTitle('Number of attendees');
      expect(attendeeCount).toBeInTheDocument();
      expect(attendeeCount).toHaveTextContent('2');

      // Verify all table cells have left alignment
      const cells = screen.getAllByRole('cell');
      cells.forEach((cell) => {
        expect(cell).toHaveClass('MuiTableCell-alignLeft');
      });
    });
  });

  // Update the non-recurring event test to also check for table cell alignment classes
  it('renders non-recurring event with no attendees correctly', async () => {
    // Test both recurring=false and without attendees
    const eventMock = {
      request: {
        query: EVENT_DETAILS,
        variables: { id: 'event456' },
      },
      result: {
        data: {
          event: {
            _id: 'event456',
            title: 'Non-Recurring Event',
            startDate: '2023-05-15',
            organization: { _id: 'org1' },
            recurring: false,
            attendees: null, // Test null case
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[eventMock]} addTypename={false}>
        <BrowserRouter>
          <table>
            <tbody>
              <CustomTableCell eventId="event456" />
            </tbody>
          </table>
        </BrowserRouter>
      </MockedProvider>,
    );

    // Wait for query to complete
    await waitFor(() => {
      // Check recurring status shows "No"
      expect(screen.getByText('No')).toBeInTheDocument();

      // Check attendee count shows "0" when attendees is null
      const attendeeCount = screen.getByTitle('Number of attendees');
      expect(attendeeCount).toHaveTextContent('0');

      // Verify all table cells have left alignment
      const cells = screen.getAllByRole('cell');
      cells.forEach((cell) => {
        expect(cell).toHaveClass('MuiTableCell-alignLeft');
      });
    });
  });
});
