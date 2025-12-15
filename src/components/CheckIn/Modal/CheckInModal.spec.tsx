import React from 'react';
import { EVENT_DETAILS, EVENT_CHECKINS } from 'GraphQl/Queries/Queries';
import { fireEvent, render, waitFor, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { InMemoryCache } from '@apollo/client';
import { CheckInModal } from './CheckInModal';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'state/store';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { ToastContainer } from 'react-toastify';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { checkInQueryMock } from '../CheckInMocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi } from 'vitest';

const link = new StaticMockLink(checkInQueryMock, true);

describe('Testing Check In Attendees Modal', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  const createCache = () =>
    new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            event: {
              merge: true,
            },
          },
        },
      },
    });

  const props = {
    show: true,
    eventId: 'event123',
    handleClose: vi.fn(),
  };

  /**
   * Test case for rendering the CheckInModal component and verifying functionality.
   * It checks that the modal renders fetched users and verifies the filtering mechanism.
   */

  test('The modal should be rendered, and all the fetched users should be shown properly and user filtering should work', async () => {
    const { queryByText, getByPlaceholderText } = render(
      <MockedProvider link={link} cache={createCache()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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

    // Tetst filtering of users
    fireEvent.change(
      getByPlaceholderText('Search Attendees') as HTMLInputElement,
      {
        target: { value: 'John Doe' },
      },
    );

    await waitFor(() => expect(queryByText('John Doe')).toBeInTheDocument());
    await waitFor(() =>
      expect(queryByText('John2 Doe2')).not.toBeInTheDocument(),
    );

    // Test clearing search
    const clearButton = screen.getByTestId('clearSearchAttendees');
    fireEvent.click(clearButton);

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
              __typename: 'Event',
              name: 'Test Event',
              description: 'Test Description',
              location: 'Test Location',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T10:00:00Z',
              endAt: '2023-01-01T12:00:00Z',
              createdAt: '2023-01-01T09:00:00Z',
              updatedAt: '2023-01-01T09:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: null,
              creator: {
                __typename: 'User',
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                __typename: 'User',
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: {
                __typename: 'Organization',
                id: 'org1',
                name: 'Test Org',
              },
              recurrenceRule: {
                __typename: 'RecurrenceRule',
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
              __typename: 'Event',
              id: 'eventRecurring',
              attendeesCheckInStatus: [
                {
                  __typename: 'AttendeeCheckInStatus',
                  id: 'checkIn1',
                  user: {
                    __typename: 'User',
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
      <MockedProvider link={linkRecurring} cache={createCache()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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
              __typename: 'Event',
              name: 'Test Event',
              description: 'Test Description',
              location: 'Test Location',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T10:00:00Z',
              endAt: '2023-01-01T12:00:00Z',
              createdAt: '2023-01-01T09:00:00Z',
              updatedAt: '2023-01-01T09:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: null,
              creator: {
                __typename: 'User',
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                __typename: 'User',
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: {
                __typename: 'Organization',
                id: 'org1',
                name: 'Test Org',
              },
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
              __typename: 'Event',
              id: 'eventUnknown',
              attendeesCheckInStatus: [
                {
                  __typename: 'AttendeeCheckInStatus',
                  id: 'checkIn2',
                  user: {
                    __typename: 'User',
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
      <MockedProvider link={linkUnknown} cache={createCache()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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
              __typename: 'Event',
              name: 'Test Event',
              description: 'Test Description',
              location: 'Test Location',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T10:00:00Z',
              endAt: '2023-01-01T12:00:00Z',
              createdAt: '2023-01-01T09:00:00Z',
              updatedAt: '2023-01-01T09:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: null,
              creator: {
                __typename: 'User',
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                __typename: 'User',
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: {
                __typename: 'Organization',
                id: 'org1',
                name: 'Test Org',
              },
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
      <MockedProvider link={linkNull} cache={createCache()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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
              __typename: 'Event',
              name: 'Test Event',
              description: 'Test Description',
              location: 'Test Location',
              allDay: false,
              isPublic: true,
              isRegisterable: true,
              startAt: '2023-01-01T10:00:00Z',
              endAt: '2023-01-01T12:00:00Z',
              createdAt: '2023-01-01T09:00:00Z',
              updatedAt: '2023-01-01T09:00:00Z',
              isRecurringEventTemplate: false,
              baseEvent: null,
              creator: {
                __typename: 'User',
                id: 'creator1',
                name: 'Creator',
                emailAddress: 'creator@example.com',
              },
              updater: {
                __typename: 'User',
                id: 'updater1',
                name: 'Updater',
                emailAddress: 'updater@example.com',
              },
              organization: {
                __typename: 'Organization',
                id: 'org1',
                name: 'Test Org',
              },
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
              __typename: 'Event',
              id: 'eventNoAttendees',
              attendeesCheckInStatus: null,
            },
          },
        },
      },
    ];

    const linkNoAttendees = new StaticMockLink(noAttendeesMock, true);

    const { queryByText } = render(
      <MockedProvider link={linkNoAttendees} cache={createCache()}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Provider store={store}>
              <I18nextProvider i18n={i18nForTest}>
                <ToastContainer />
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
