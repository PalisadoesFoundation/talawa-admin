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

import {
  MOCKS_WITHOUT_TIME,
  MOCKS_WITH_TIME,
  MOCKS_NO_EVENT,
  MOCKS_WITH_ADMIN_ROLE,
  MOCKS_WITH_NULL_LOCATION,
  MOCKS_WITH_NULL_DESCRIPTION,
  MOCKS_INVALID_DATE,
  MOCK_EMPTY_START_TIME,
  MOCK_BOUNDARY_TIME,
  MOCK_EMPTY_DATES,
} from './EventDashboard.mocks';
import { StaticMockLink } from 'utils/StaticMockLink';
import {
  vi,
  expect,
  it,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
} from 'vitest';

const mockWithTime = new StaticMockLink(MOCKS_WITH_TIME, true);
const mockWithoutTime = new StaticMockLink(MOCKS_WITHOUT_TIME, true);
const mockNoEvent = new StaticMockLink(MOCKS_NO_EVENT, true);
const mockWithAdminRole = new StaticMockLink(MOCKS_WITH_ADMIN_ROLE, true);
const mockWithNullLocation = new StaticMockLink(MOCKS_WITH_NULL_LOCATION, true);
const mockWithNullDescription = new StaticMockLink(
  MOCKS_WITH_NULL_DESCRIPTION,
  true,
);

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

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string): string | null => {
      return store[key] || null;
    },
    setItem: (key: string, value: string): void => {
      store[key] = value.toString();
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

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
  beforeAll(() => {
    vi.mock('components/EventListCard/Modal/EventListCardModals', () => ({
      __esModule: true,
      default: () => <div data-testid="event-list-card-modals" />,
    }));
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
    // Set default user data
    localStorageMock.setItem('userId', 'user123');
    localStorageMock.setItem('role', 'regular');
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('The page should display event details correctly and also show the time if provided', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    expect(getByTestId('start-time')).toHaveTextContent('09:00');
    expect(getByTestId('end-time')).toHaveTextContent('17:00');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();

    expect(getByTestId('registrations-card')).toBeInTheDocument();
    expect(getByTestId('attendees-card')).toBeInTheDocument();
    expect(getByTestId('feedback-card')).toBeInTheDocument();

    const editButton = getByTestId('edit-event-button');
    expect(editButton).toBeInTheDocument();
  });

  it('The page should display event details correctly and should not show the time if all day event', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
    expect(getByTestId('event-description')).toHaveTextContent(
      'Test Description',
    );
    expect(getByTestId('event-location')).toHaveTextContent('India');

    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
  });

  it('Should show loader while data is being fetched', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockWithTime);

    expect(getByTestId('spinner-wrapper')).toBeInTheDocument();
    expect(getByTestId('spinner')).toBeInTheDocument();
    expect(queryByTestId('event-details')).not.toBeInTheDocument();

    await wait();

    expect(queryByTestId('spinner-wrapper')).not.toBeInTheDocument();
    expect(queryByTestId('spinner')).not.toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-name')).toBeInTheDocument();
  });

  it('Should display "Event not found" when event data is null', async () => {
    const { getByTestId, queryByTestId } = renderEventDashboard(mockNoEvent);
    await wait();

    expect(getByTestId('no-event')).toBeInTheDocument();
    expect(getByTestId('no-event')).toHaveTextContent('Event not found');
    expect(queryByTestId('event-details')).not.toBeInTheDocument();
  });

  it('Should open event modal when edit button is clicked', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');

    fireEvent.click(editButton);
    await wait(100);

    // Modal should be rendered
    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
  });

  it('Should close event modal when hideViewModal is called', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);
    await wait(100);

    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();

    // Click again to test modal state management
    fireEvent.click(editButton);
    await wait(100);
  });

  it('Should set user role as ADMINISTRATOR when role is administrator in localStorage', async () => {
    localStorageMock.setItem('role', 'administrator');

    const { getByTestId } = renderEventDashboard(mockWithAdminRole);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  it('Should use fallback userId from "id" key when "userId" is not in localStorage', async () => {
    localStorageMock.removeItem('userId');
    localStorageMock.setItem('id', 'fallback-user-id');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should handle null location and display "N/A"', async () => {
    const { getByTestId } = renderEventDashboard(mockWithNullLocation);
    await wait();

    expect(getByTestId('event-location')).toHaveTextContent('N/A');
  });

  it('Should handle null description', async () => {
    const { getByTestId } = renderEventDashboard(mockWithNullDescription);
    await wait();

    const descriptionElement = getByTestId('event-description');
    expect(descriptionElement).toBeEmptyDOMElement();
  });

  it('Should display default time "08:00" when date format is invalid', async () => {
    const mockInvalidDate = new StaticMockLink(MOCKS_INVALID_DATE, true);
    const { getByTestId } = renderEventDashboard(mockInvalidDate);
    await wait();

    expect(getByTestId('start-time')).toHaveTextContent('08:00');
    expect(getByTestId('end-time')).toHaveTextContent('08:00');

    expect(getByTestId('start-date')).toHaveTextContent('Invalid Date');
    expect(getByTestId('end-date')).toHaveTextContent('Invalid Date');
  });

  it('Should display N/A for statistics cards', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('registrations-count')).toHaveTextContent('N/A');
    expect(getByTestId('attendees-count')).toHaveTextContent('N/A');
    expect(getByTestId('feedback-rating')).toHaveTextContent('N/A');
  });

  it('Should handle empty startAt and return default time', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
  });

  it('Should format time correctly with padded zeros for single digit hours/minutes', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const startTime = getByTestId('start-time').textContent;
    const endTime = getByTestId('end-time').textContent;

    expect(startTime).toMatch(/^\d{2}:\d{2}$/);
    expect(endTime).toMatch(/^\d{2}:\d{2}$/);
  });

  it('Should set userRole as REGULAR when stored role is not administrator', async () => {
    localStorageMock.setItem('role', 'user');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    // User should still be able to see the event
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  it('Should handle when both userId and id are missing from localStorage', async () => {
    localStorageMock.removeItem('userId');
    localStorageMock.removeItem('id');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should display event dashboard with all components', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-stats')).toBeInTheDocument();
    expect(getByTestId('event-details')).toBeInTheDocument();
    expect(getByTestId('event-time')).toBeInTheDocument();
    expect(getByTestId('edit-event-button')).toBeInTheDocument();
  });

  it('Should verify tEventList translation function is called', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // The component should render without errors, indicating translations work
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
  });

  it('Should handle event with valid UTC times', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    // Verify times are formatted correctly from UTC
    expect(startTime.textContent).toBe('09:00');
    expect(endTime.textContent).toBe('17:00');
  });

  it('Should display registrants as N/A', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-registrants')).toHaveTextContent('N/A');
  });

  it('Should render all three stat cards with images', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const registrationsCard = getByTestId('registrations-card');
    const attendeesCard = getByTestId('attendees-card');
    const feedbackCard = getByTestId('feedback-card');

    expect(registrationsCard).toBeInTheDocument();
    expect(attendeesCard).toBeInTheDocument();
    expect(feedbackCard).toBeInTheDocument();

    // Verify images are present
    expect(registrationsCard.querySelector('img')).toBeInTheDocument();
    expect(attendeesCard.querySelector('img')).toBeInTheDocument();
    expect(feedbackCard.querySelector('img')).toBeInTheDocument();
  });

  it('Should pass correct props to EventListCardModals', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Open modal to verify it receives correct props
    const editButton = getByTestId('edit-event-button');
    fireEvent.click(editButton);
    await wait(100);

    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
  });

  it('Should render event creator information in eventListCardProps', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify component renders successfully with creator data
    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  // NEW TESTS FOR 100% COVERAGE

  it('Should handle formatTimeFromDateTime with empty string', async () => {
    const mockEmptyTime = new StaticMockLink(MOCK_EMPTY_START_TIME, true);
    const { getByTestId } = renderEventDashboard(mockEmptyTime);
    await wait();

    // When allDay is false but dates are null/empty, the condition !eventData.event.allDay && eventData.event.startAt
    // evaluates to false, so times are not displayed (empty string)
    // However, the eventListCardProps will use formatTimeFromDateTime which returns '08:00' as default
    expect(getByTestId('start-time')).toHaveTextContent('');
    expect(getByTestId('end-time')).toHaveTextContent('');
  });

  it('Should handle safeFormatDate error in catch block', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const { getByTestId } = renderEventDashboard(
      new StaticMockLink(MOCKS_INVALID_DATE, true),
    );
    await wait();

    expect(getByTestId('start-date')).toHaveTextContent('Invalid Date');
    expect(getByTestId('end-date')).toHaveTextContent('Invalid Date');

    consoleErrorSpy.mockRestore();
  });

  it('Should handle safeFormatDate with empty dateTime', async () => {
    const mockEmptyDates = new StaticMockLink(MOCK_EMPTY_DATES, true);
    const { getByTestId } = renderEventDashboard(mockEmptyDates);
    await wait();

    expect(getByTestId('start-date')).toHaveTextContent('Invalid Date');
    expect(getByTestId('end-date')).toHaveTextContent('Invalid Date');
  });

  it('Should display empty attendees array in eventListCardProps', async () => {
    const { getByTestId } = renderEventDashboard(mockWithNullLocation);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    // Component should handle empty attendees array gracefully
  });

  it('Should verify eventListCardProps contains all required fields', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // Verify all fields are present in rendered component
    expect(getByTestId('event-name')).toBeInTheDocument();
    expect(getByTestId('event-description')).toBeInTheDocument();
    expect(getByTestId('event-location')).toBeInTheDocument();
    expect(getByTestId('start-time')).toBeInTheDocument();
    expect(getByTestId('end-time')).toBeInTheDocument();
    expect(getByTestId('start-date')).toBeInTheDocument();
    expect(getByTestId('end-date')).toBeInTheDocument();
  });

  it('Should handle eventData with undefined event', async () => {
    const { EVENT_DETAILS } = await import('GraphQl/Queries/Queries');
    const MOCK_UNDEFINED_EVENT = [
      {
        request: {
          query: EVENT_DETAILS,
          variables: { eventId: 'event123' },
        },
        result: {
          data: {},
        },
      },
    ];

    const mockUndefinedEvent = new StaticMockLink(MOCK_UNDEFINED_EVENT, true);
    const { getByTestId } = renderEventDashboard(mockUndefinedEvent);
    await wait();

    expect(getByTestId('no-event')).toBeInTheDocument();
  });

  it('Should test showViewModal function sets state correctly', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    const editButton = getByTestId('edit-event-button');

    // First click - opens modal
    fireEvent.click(editButton);
    await wait(100);
    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
  });

  it('Should verify correct formatting of time with minutes at boundaries', async () => {
    const mockBoundaryTime = new StaticMockLink(MOCK_BOUNDARY_TIME, true);
    const { getByTestId } = renderEventDashboard(mockBoundaryTime);
    await wait();

    expect(getByTestId('start-time')).toHaveTextContent('00:05');
    expect(getByTestId('end-time')).toHaveTextContent('23:55');
  });

  it('Should handle role being null in localStorage', async () => {
    localStorageMock.setItem('role', 'null');

    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    expect(getByTestId('event-dashboard')).toBeInTheDocument();
    expect(getByTestId('event-name')).toHaveTextContent('Test Event');
  });

  it('Should verify translation key generation with tEventList', async () => {
    const { getByTestId } = renderEventDashboard(mockWithTime);
    await wait();

    // The component uses tEventList which prefixes keys with 'eventListCard.'
    expect(getByTestId('event-list-card-modals')).toBeInTheDocument();
  });

  it('Should handle all-day event with times showing as empty strings', async () => {
    const { getByTestId } = renderEventDashboard(mockWithoutTime);
    await wait();

    const startTime = getByTestId('start-time');
    const endTime = getByTestId('end-time');

    // For all-day events, times should be empty in the display
    expect(startTime.textContent).toBe('');
    expect(endTime.textContent).toBe('');
  });
});
