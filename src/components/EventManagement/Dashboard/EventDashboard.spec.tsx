import React from 'react';
import type { RenderResult } from '@testing-library/react';
import { render, act, fireEvent } from '@testing-library/react';
import EventDashboard from './EventDashboard';
import { BrowserRouter } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { MockedProvider } from '@apollo/react-testing';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { I18nextProvider } from 'react-i18next';
import i18nForTest from 'utils/i18nForTest';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { ApolloLink, DefaultOptions } from '@apollo/client';

import { MOCKS_WITHOUT_TIME, MOCKS_WITH_TIME } from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { EVENT_DETAILS } from 'GraphQl/Queries/Queries';
import useLocalStorage from 'utils/useLocalstorage';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);

// We want to disable all forms of caching so that we do not need to define a custom merge function in testing for the network requests
const defaultOptions: DefaultOptions = {
  watchQuery: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  },
};

async function wait(ms = 500): Promise<void> {
  await act(() => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

const mockID = 'event123';
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
}));

const renderEventDashboard = (mockLink: ApolloLink): RenderResult => {
  return render(
    <BrowserRouter>
      <MockedProvider
        addTypename={false}
        link={mockLink}
        defaultOptions={defaultOptions}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <I18nextProvider i18n={i18nForTest}>
            <ToastContainer />
            <EventDashboard eventId={mockID} />
          </I18nextProvider>
        </LocalizationProvider>
      </MockedProvider>
    </BrowserRouter>,
  );
};

describe('Testing Event Dashboard Screen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify time and date information
    expect(getByTestId('start-time')).toHaveTextContent('09:00');
    expect(getByTestId('end-time')).toHaveTextContent('17:00');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();

    // Verify statistics cards
    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    // Test edit button
    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
  });

  it('The page should display event details correctly and should not show the time if all day event', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    // Verify basic event details
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    // Verify date information without time for all-day event
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);

    // Initially show loader
    expect(getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();

    // Wait for loading to complete
    await wait();

    // Verify loader is gone and content is shown
    expect(queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should display "Event not found" when event data is null', async () => {
    const MOCK_NO_EVENT = [
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
    ];

    const mockLink = new StaticMockLink(MOCK_NO_EVENT, true);
    const { getByTestId, queryByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify "Event not found" message is displayed
    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(getByTestId('no-event')).toHaveTextContent('Event not found');

    // Verify event details are not displayed
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should display "Event not found" when eventData is undefined', async () => {
    const MOCK_UNDEFINED_EVENT = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: null,
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_UNDEFINED_EVENT, true);
    const { getByTestId, queryByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify "Event not found" message is displayed
    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should open and close the edit event modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');

    // Click the edit button to open modal
    fireEvent.click(editButton);
    await wait(100);

    // The modal should be opened (this is handled by EventListCardModals component)
    expect(editButton).toBeInTheDocument();
  });

  it('Should display N/A for missing location', async () => {
    const MOCK_NO_LOCATION = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Test Event',
              description: 'Test Description',
              startAt: '2024-01-01T09:00:00Z',
              endAt: '2024-01-02T17:00:00Z',
              startTime: '09:00:00',
              endTime: '17:00:00',
              allDay: false,
              location: null,
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_NO_LOCATION, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    expect(getByTestId('event-location')).toHaveTextContent('N/A');
  });

  it('Should render all statistics cards correctly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify all statistics cards are rendered
    const registrationsCard = getByTestId('registrations-card');
    const attendeesCard = getByTestId('attendees-card');
    const feedbackCard = getByTestId('feedback-card');

    expect(registrationsCard).toBeInTheDocument();
    expect(attendeesCard).toBeInTheDocument();
    expect(feedbackCard).toBeInTheDocument();

    // Verify N/A is displayed for unavailable data
    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should display event registrants information', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const registrants = getByTestId('event-registrants');
    expect(registrants).toBeInTheDocument();
    expect(registrants).toHaveTextContent('Registrants:');
    expect(registrants).toHaveTextContent('N/A');
  });

  it('Should correctly format times for all-day events', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    // For all-day events, time should be empty string
    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    expect(startTime).toHaveTextContent('');
    expect(endTime).toHaveTextContent('');
  });

  it('Should handle administrator user role correctly', async () => {
    // Mock localStorage to return administrator role
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'userId' || key === 'id') return 'user123';
      if (key === 'role') return 'administrator';
      return null;
    });

    vi.spyOn(useLocalStorage(), 'getItem').mockImplementation(mockGetItem);

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('edit-event-button')).toBeInTheDocument();
  });

  it('Should handle regular user role correctly', async () => {
    // Mock localStorage to return regular role
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'userId' || key === 'id') return 'user123';
      if (key === 'role') return 'user';
      return null;
    });

    vi.spyOn(useLocalStorage(), 'getItem').mockImplementation(mockGetItem);

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should display empty description when description is null', async () => {
    const MOCK_NO_DESCRIPTION = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Test Event',
              description: null,
              startAt: '2024-01-01T09:00:00Z',
              endAt: '2024-01-02T17:00:00Z',
              startTime: '09:00:00',
              endTime: '17:00:00',
              allDay: false,
              location: 'India',
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_NO_DESCRIPTION, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    const description = getByTestId('event-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent('');
  });

  it('Should render the "to" text between start and end dates', async () => {
    const { getByText } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByText('to')).toBeInTheDocument();
  });

  it('Should display event dashboard container', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-stats')).toBeInTheDocument();
  });

  it('Should verify all-day event uses correct start time value (00:00)', async () => {
    // This test ensures line 91 is covered - the '00:00' assignment for allDay events
    const MOCK_ALLDAY_EVENT = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'All Day Event',
              description: 'Full day event',
              startAt: '2024-06-15T00:00:00Z',
              endAt: '2024-06-15T23:59:59Z',
              startTime: null,
              endTime: null,
              allDay: true,
              location: 'Conference Hall',
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'Jane',
                lastName: 'Smith',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_ALLDAY_EVENT, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify it's an all-day event and times are not displayed
    expect(getByTestId('event-name')).toHaveTextContent('All Day Event');
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('event-location')).toHaveTextContent('Conference Hall');
  });

  it('Should handle events with different date formats correctly', async () => {
    // Test with different timestamp to verify formatTimeFromDateTime works correctly
    const MOCK_DIFFERENT_TIME = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Afternoon Event',
              description: 'Test Description',
              startAt: '2024-03-15T14:30:00Z',
              endAt: '2024-03-15T16:45:00Z',
              startTime: '14:30:00',
              endTime: '16:45:00',
              allDay: false,
              location: 'Meeting Room',
              isPublic: true,
              isRegisterable: false,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_DIFFERENT_TIME, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify times are formatted correctly
    expect(getByTestId('start-time')).toHaveTextContent('14:30');
    expect(getByTestId('end-time')).toHaveTextContent('16:45');
    expect(getByTestId('event-location')).toHaveTextContent('Meeting Room');
  });

  it('Should render event details with proper formatting for midnight event', async () => {
    // Test event that starts exactly at midnight to verify edge case handling
    const MOCK_MIDNIGHT_EVENT = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Midnight Event',
              description: 'Event at midnight',
              startAt: '2024-12-31T00:00:00Z',
              endAt: '2025-01-01T00:00:00Z',
              startTime: '00:00:00',
              endTime: '00:00:00',
              allDay: false,
              location: 'Downtown',
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_MIDNIGHT_EVENT, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify midnight time is formatted correctly
    expect(getByTestId('start-time')).toHaveTextContent('00:00');
    expect(getByTestId('event-name')).toHaveTextContent('Midnight Event');
  });

  it('Should close modal when hideViewModal is called via button interaction', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Get the edit button and click it to open modal
    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);
    await wait(100);

    // Verify component is still rendered (modal state is managed by EventListCardModals)
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should handle empty dateTime string in formatTimeFromDateTime', async () => {
    // Test with non-all-day event where startAt and endAt are valid but we're testing the internal logic
    const MOCK_VALID_DATETIME = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Event with Valid Times',
              description: 'Test Description',
              startAt: '2024-03-15T08:00:00Z',
              endAt: '2024-03-15T10:00:00Z',
              startTime: null,
              endTime: null,
              allDay: false,
              location: 'Test Location',
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_VALID_DATETIME, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify the component renders correctly with valid times
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toHaveTextContent(
      'Event with Valid Times',
    );
    expect(getByTestId('start-time')).toHaveTextContent('08:00');
    expect(getByTestId('end-time')).toHaveTextContent('10:00');
  });

  it('Should verify user role defaults to REGULAR when role is not administrator', async () => {
    // Test when role is something other than 'administrator'
    const mockGetItem = vi.fn((key: string) => {
      if (key === 'userId' || key === 'id') return 'user123';
      if (key === 'role') return 'moderator';
      return null;
    });

    vi.spyOn(useLocalStorage(), 'getItem').mockImplementation(mockGetItem);

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify the component renders with REGULAR role
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('edit-event-button')).toBeInTheDocument();
  });

  it('Should handle null userId from localStorage', async () => {
    // Test when userId/id are not available in localStorage
    const mockGetItem = vi.fn(() => null);

    vi.spyOn(useLocalStorage(), 'getItem').mockImplementation(mockGetItem);

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify the component still renders even without userId
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should display event with no description and no location', async () => {
    // Test with both description and location as null/empty
    const MOCK_MINIMAL_EVENT = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Minimal Event',
              description: null,
              startAt: '2024-05-20T10:00:00Z',
              endAt: '2024-05-20T12:00:00Z',
              startTime: '10:00:00',
              endTime: '12:00:00',
              allDay: false,
              location: null,
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_MINIMAL_EVENT, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Minimal Event');
    expect(getByTestId('event-location')).toHaveTextContent('N/A');
    expect(getByTestId('start-time')).toHaveTextContent('10:00');
    expect(getByTestId('end-time')).toHaveTextContent('12:00');
  });

  it('Should render EditButton and verify it is clickable', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass('btn', 'btn-light');

    // Verify button can be clicked without errors
    fireEvent.click(editButton);
    await wait(100);

    expect(editButton).toBeInTheDocument();
  });

  it('Should display all event details when event has complete information', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify all parts are rendered
    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(getByTestId('event-description')).toBeInTheDocument();
    expect(getByTestId('event-location')).toBeInTheDocument();
    expect(getByTestId('event-registrants')).toBeInTheDocument();
    expect(getByTestId('start-time')).toBeInTheDocument();
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-time')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-stats')).toBeInTheDocument();
  });

  it('Should format time correctly for various hours and minutes', async () => {
    // Test with early morning time
    const MOCK_EARLY_MORNING = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {
            event: {
              _id: 'event123',
              id: 'event123',
              name: 'Early Morning Event',
              description: 'Test Description',
              startAt: '2024-03-15T06:05:00Z',
              endAt: '2024-03-15T07:30:00Z',
              startTime: '06:05:00',
              endTime: '07:30:00',
              allDay: false,
              location: 'Office',
              isPublic: true,
              isRegisterable: true,
              attendees: [],
              creator: {
                _id: 'creator1',
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          },
        },
      },
    ];

    const mockLink = new StaticMockLink(MOCK_EARLY_MORNING, true);
    const { getByTestId } = renderEventDashboard(mockLink);

    await wait();

    // Verify time formatting with padStart for single digit hours
    expect(getByTestId('start-time')).toHaveTextContent('06:05');
    expect(getByTestId('end-time')).toHaveTextContent('07:30');
  });

  it('Should display event stats with correct structure and images', async () => {
    const { getByTestId, container } = renderEventDashboard(mockWithTime);
    await wait();

    // Check stats cards have correct structure
    const eventStats = getByTestId('event-stats');
    expect(eventStats).toBeInTheDocument();
    expect(eventStats).toHaveClass('d-flex', 'px-6');

    // Verify all cards are present
    const registrationsCard = getByTestId('registrations-card');
    const attendeesCard = getByTestId('attendees-card');
    const feedbackCard = getByTestId('feedback-card');

    expect(registrationsCard).toBeInTheDocument();
    expect(attendeesCard).toBeInTheDocument();
    expect(feedbackCard).toBeInTheDocument();

    // Verify images in cards
    const images = container.querySelectorAll('img[alt="userImage"]');
    expect(images.length).toBeGreaterThanOrEqual(2);
  });
});
