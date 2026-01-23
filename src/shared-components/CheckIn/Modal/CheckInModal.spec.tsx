import React from 'react';
import { EVENT_DETAILS, EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import { render, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { CheckInModal } from './CheckInModal';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import {
  LocalizationProvider,
  AdapterDayjs,
} from 'shared-components/DateRangePicker';
import { checkInQueryMock } from '../CheckInMocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

const link = new StaticMockLink(checkInQueryMock, true);

describe('Testing Check In Attendees Modal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  const props = {
    show: true,
    eventId: 'event123',
    handleClose: vi.fn(),
  };
  const user = userEvent.setup();

  /**
   * Test case for rendering the CheckInModal component and verifying functionality.
   * It checks that the modal renders fetched users and verifies the filtering mechanism.
   */

  test('The modal should be rendered, and all the fetched users should be shown properly and user filtering should work', async () => {
    const { queryByText, getByPlaceholderText } = render(
      <MockedProvider link={link}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInModal {...props} />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Event Check In Management')).toBeInTheDocument(),
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
    await waitFor(() => expect(queryByText('John2 Doe2')).toBeInTheDocument());

    // Test filtering of users
    await user.type(
      getByPlaceholderText('Search Attendees') as HTMLInputElement,
      'John Doe',
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('John2 Doe2')).not.toBeInTheDocument(),
    );

    // Test clearing search
    const clearButton = screen.getByTestId('clearSearchAttendees');
    await user.click(clearButton);

    await waitFor(() => expect(queryByText('John2 Doe2')).toBeInTheDocument());
  });

  test('should handle recurring events correctly', async () => {
    const recurringMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'eventRecurring' },
        },
        result: {
          data: {
            event: {
              id: 'eventRecurring',
              recurrenceRule: {
                id: 'FREQ=DAILY',
              },
            },
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'eventRecurring' },
        },
        result: {
          data: {
            event: {
              id: 'eventRecurring',
              attendeesCheckInStatus: [
                {
                  id: 'checkIn1',
                  user: {
                    id: 'user1',
                    name: 'Test User',
                    emailAddress: 'test@example.com',
                  },
                  checkInTime: null,
                  checkOutTime: null,
                  isCheckedIn: false,
                  isCheckedOut: false,
                },
              ],
            },
          },
        },
      },
    ];

    const linkRecurring = new StaticMockLink(recurringMock, true);

    const { queryByText, findByText } = render(
      <MockedProvider link={linkRecurring}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInModal {...props} eventId="eventRecurring" />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(queryByText('Event Check In Management')).toBeInTheDocument(),
    );

    // Verify that the attendee is rendered
    expect(await findByText('Test User')).toBeInTheDocument();
  });

  test('should handle user with no name (Unknown User)', async () => {
    const unknownUserMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'eventUnknown' },
        },
        result: {
          data: {
            event: {
              id: 'eventUnknown',
              recurrenceRule: null,
            },
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'eventUnknown' },
        },
        result: {
          data: {
            event: {
              id: 'eventUnknown',
              attendeesCheckInStatus: [
                {
                  id: 'checkIn2',
                  user: {
                    id: 'user2',
                    name: null, // No name
                    emailAddress: 'unknown@example.com',
                  },
                  checkInTime: null,
                  checkOutTime: null,
                  isCheckedIn: false,
                  isCheckedOut: false,
                },
              ],
            },
          },
        },
      },
    ];

    const linkUnknown = new StaticMockLink(unknownUserMock, true);

    const { findByText } = render(
      <MockedProvider link={linkUnknown}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInModal {...props} eventId="eventUnknown" />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    expect(await findByText('Unknown User')).toBeInTheDocument();
  });

  test('should handle null checkInData gracefully', async () => {
    const nullDataMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'eventNull' },
        },
        result: {
          data: {
            event: {
              id: 'eventNull',
              recurrenceRule: null,
            },
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'eventNull' },
        },
        result: {
          data: null,
        },
      },
    ];

    const linkNull = new StaticMockLink(nullDataMock, true);

    const { queryByText } = render(
      <MockedProvider link={linkNull}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInModal {...props} eventId="eventNull" />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      // Should not render any rows
      expect(queryByText('Test User')).not.toBeInTheDocument();
    });
  });

  test('should handle null attendeesCheckInStatus gracefully', async () => {
    const noAttendeesMock = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'eventNoAttendees' },
        },
        result: {
          data: {
            event: {
              id: 'eventNoAttendees',
              recurrenceRule: null,
            },
          },
        },
      },
      {
        request: {
          query: EVENT_CHECKINS,
          variables: { eventId: 'eventNoAttendees' },
        },
        result: {
          data: {
            event: {
              id: 'eventNoAttendees',
              attendeesCheckInStatus: null,
            },
          },
        },
      },
    ];

    const linkNoAttendees = new StaticMockLink(noAttendeesMock, true);

    const { queryByText } = render(
      <MockedProvider link={linkNoAttendees}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <CheckInModal {...props} eventId="eventNoAttendees" />
              </I18nextProvider>
            </Provider>
          </LocalizationProvider>
        </BrowserRouter>
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(queryByText('Test User')).not.toBeInTheDocument();
    });
  });
});
